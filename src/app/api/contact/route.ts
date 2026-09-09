import { NextResponse } from "next/server";
import { sendContactEmail, isEmailConfigured } from "@/server/email";
import { getPersonalContactEmail } from "@/services/personalService";
import { SMTP_FROM, SMTP_USER } from "@/config/variables";

/**
 * POST /api/contact — send a portfolio contact message via SMTP.
 *
 * The recipient is the personal contact email (type "mail") from the
 * database; when the profile has no mail contact yet it falls back to the
 * configured sender address so messages still reach the owner.
 *
 * Anti-spam layers:
 * - Honeypot field (`website`): must stay empty — bots fill hidden
 *   inputs, humans never see one. Rejected silently as success.
 * - Field length caps (name/email/message) so a single request cannot
 *   push a multi-megabyte payload into the SMTP pipeline.
 * - Rolling rate limits in-process (a Map on the server instance):
 *   one message per sender email AND per client IP per 24h window.
 *   In-memory limits are weak on serverless (each cold start starts a
 *   fresh instance) but still blunt the obvious sweeps; a persistent
 *   store (Upstash/Vercel KV) can replace `lastSentAt` later without
 *   touching the rest of the route.
 */

/** Rolling window before the same email/IP may send again (ms). */
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

/** Field length caps (characters). */
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

const lastSentAt = new Map<string, number>();

/** Prune entries older than the window so the map never grows unbounded. */
function pruneRateLimits(now: number): void {
  for (const [key, sentAt] of lastSentAt) {
    if (now - sentAt >= RATE_LIMIT_MS) lastSentAt.delete(key);
  }
}

/** True when the key already sent within the rolling window. */
function isRateLimited(key: string, now: number): boolean {
  const sentAt = lastSentAt.get(key);
  return !!sentAt && now - sentAt < RATE_LIMIT_MS;
}

/** Client IP behind Vercel/proxies (`x-forwarded-for` first hop). */
function clientIpOf(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || "unknown";
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — hidden from humans, auto-filled by bots. */
  website?: unknown;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot: a filled hidden field means a bot. Answer "success" so the
  // bot learns nothing and moves on (no email is sent).
  if (isNonEmptyString(body.website)) {
    return NextResponse.json({ success: true });
  }

  const name = isNonEmptyString(body.name) ? body.name.trim() : "";
  const email = isNonEmptyString(body.email)
    ? body.email.trim().toLowerCase()
    : "";
  const message = isNonEmptyString(body.message) ? body.message.trim() : "";

  if (!name || !email || !EMAIL_PATTERN.test(email) || !message) {
    return NextResponse.json(
      { success: false, error: "Please complete all fields correctly." },
      { status: 400 },
    );
  }

  // Length caps — keep oversized payloads out of the SMTP pipeline.
  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      {
        success: false,
        error: `Message too long. Please keep the name under ${MAX_NAME_LENGTH} characters and the message under ${MAX_MESSAGE_LENGTH}.`,
      },
      { status: 400 },
    );
  }

  const now = Date.now();
  pruneRateLimits(now);

  // Per-email and per-IP limits share the same window — closing the
  // "many different emails from one machine" sweep within an instance.
  const rateLimitKeys = [email, clientIpOf(request)];
  const limitedKey = rateLimitKeys.find((key) => isRateLimited(key, now));
  if (limitedKey) {
    const sentAt = lastSentAt.get(limitedKey)!;
    const hoursLeft = Math.ceil((RATE_LIMIT_MS - (now - sentAt)) / 3_600_000);
    return NextResponse.json(
      {
        success: false,
        error: `You've already sent a message. Please try again in about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`,
      },
      { status: 429 },
    );
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { success: false, error: "Email delivery is not configured." },
      { status: 503 },
    );
  }

  // Personal "mail" contact first; fall back to the sender address when
  // the profile has no mail contact yet so messages still get through.
  const dbRecipient = await getPersonalContactEmail();
  if (!dbRecipient) {
    console.warn(
      "[contact] no mail contact on the personal profile — falling back to the SMTP sender address",
    );
  }
  const recipient = dbRecipient || SMTP_FROM || SMTP_USER;
  if (!recipient) {
    return NextResponse.json(
      { success: false, error: "No recipient email available." },
      { status: 503 },
    );
  }

  const sent = await sendContactEmail({ name, email, message }, recipient);
  if (!sent) {
    return NextResponse.json(
      { success: false, error: "Failed to send. Please try again later." },
      { status: 500 },
    );
  }

  for (const key of rateLimitKeys) {
    lastSentAt.set(key, now);
  }
  return NextResponse.json({ success: true });
}

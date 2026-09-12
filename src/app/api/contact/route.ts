import { NextResponse } from "next/server";
import { sendContactEmail, isEmailConfigured } from "@/server/email";
import { getPersonalContactEmail } from "@/services/personalService";
import { SMTP_FROM, SMTP_USER } from "@/config/variables";
import { checkRateLimits, recordRateLimits } from "@/server/rate-limit";

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
 * - Rate limits: one message per sender email AND per client IP per 24h
 *   window. Timestamps persist in Upstash Redis when configured (shared
 *   across serverless instances) with an in-memory fallback — see
 *   `src/server/rate-limit.ts`.
 */

/** Field length caps (characters). */
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;

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

/**
 * Strip control characters (CRLF included) from the display name. The
 * name lands in the email subject header — this makes header-injection
 * attempts fail explicitly at the validation layer instead of relying on
 * Nodemailer's internal rejection. Newlines become spaces; the message
 * body keeps its line breaks (it is body-only, never a header).
 */
function sanitizeName(name: string): string {
  return name.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
}

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

  const name = isNonEmptyString(body.name) ? sanitizeName(body.name) : "";
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

  // Per-email and per-IP limits share the same window — closing the
  // "many different emails from one machine" sweep across instances.
  const rateLimitKeys = [email, clientIpOf(request)];
  const { limited, retryAfterMs } = await checkRateLimits(rateLimitKeys);
  if (limited && retryAfterMs !== null) {
    const hoursLeft = Math.max(1, Math.ceil(retryAfterMs / 3_600_000));
    return NextResponse.json(
      {
        success: false,
        error: `You've already sent a message. Please try again in about ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`,
      },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
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

  await recordRateLimits(rateLimitKeys);
  return NextResponse.json({ success: true });
}


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
 * Rate limit: one message per sender email per rolling 24h window. Kept
 * in-process (a Map on the server instance): good enough for a portfolio
 * and requires no schema change on the shared admin database.
 */

/** Rolling window before the same email may send again (ms). */
const RATE_LIMIT_MS = 24 * 60 * 60 * 1000;

const lastSentAt = new Map<string, number>();

/** Prune entries older than the window so the map never grows unbounded. */
function pruneRateLimits(now: number): void {
  for (const [email, sentAt] of lastSentAt) {
    if (now - sentAt >= RATE_LIMIT_MS) lastSentAt.delete(email);
  }
}

interface ContactBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
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

  const now = Date.now();
  pruneRateLimits(now);
  const sentAt = lastSentAt.get(email);
  if (sentAt && now - sentAt < RATE_LIMIT_MS) {
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

  lastSentAt.set(email, now);
  return NextResponse.json({ success: true });
}

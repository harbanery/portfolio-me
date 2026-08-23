import nodemailer, { type Transporter } from "nodemailer";
import {
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
} from "@/config/variables";

/**
 * SMTP email service via Nodemailer — same lazy-transporter pattern as
 * progress-self. With SMTP_HOST empty the channel is treated as
 * unconfigured so environments without email keep working. The recipient
 * is the personal contact email from the database, passed in by the
 * caller — not an environment variable.
 */

let transporter: Transporter | null = null;

/** True when SMTP credentials are configured. */
export function isEmailConfigured(): boolean {
  return Boolean(SMTP_HOST && SMTP_USER);
}

/** Initialize the SMTP transporter once (lazy). */
function getTransporter(): Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
}

/** Escape HTML so visitor input stays inert inside the email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Preserve message line breaks in the HTML version. */
function messageToHtml(message: string): string {
  return escapeHtml(message).replace(/\r?\n/g, "<br>");
}

/**
 * Contact-form email, styled after the progress-self notification design
 * (single-column card, inline styles, one accent button) with this site's
 * tan accent.
 */
function buildContactEmail(payload: ContactEmailPayload): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `Portfolio message from ${payload.name}`;
  const text = [
    `New message via the portfolio contact form.`,
    ``,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    ``,
    payload.message,
  ].join("\n");

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1f2937">
  <h2 style="margin:0 0 12px">New portfolio message</h2>
  <p style="font-size:15px;line-height:1.6;margin:0 0 8px"><b style="font-weight:600">From:</b> ${escapeHtml(payload.name)} &lt;<a href="mailto:${escapeHtml(payload.email)}" style="color:#b8925f;text-decoration:none">${escapeHtml(payload.email)}</a>&gt;</p>
  <div style="font-size:15px;line-height:1.6;margin:0 0 16px;padding:12px 16px;background:#f9fafb;border-left:3px solid #deb887;border-radius:4px">
    ${messageToHtml(payload.message)}
  </div>
  <p style="margin:0">
    <a href="mailto:${escapeHtml(payload.email)}" style="display:inline-block;padding:10px 18px;background:#b8925f;color:#ffffff;border-radius:6px;text-decoration:none;font-size:14px">Reply by email</a>
  </p>
</div>`;

  return { subject, text, html };
}

/**
 * Send a contact-form message to the given recipient inbox (the personal
 * contact email from the database).
 * Returns true on success, false on failure or missing configuration.
 */
export async function sendContactEmail(
  payload: ContactEmailPayload,
  to: string,
): Promise<boolean> {
  if (!isEmailConfigured() || !to) return false;
  try {
    const { subject, text, html } = buildContactEmail(payload);
    const transport = getTransporter();
    await transport.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to,
      replyTo: payload.email,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email] error sending contact message:", err);
    return false;
  }
}

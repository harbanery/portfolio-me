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

/** Theme color of the contact email — this site's tan accent. */
const THEME_COLOR = "#b8925f";

const FONT_STACK =
  "'Geist','Google Sans',Roboto,Helvetica,Arial,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

/**
 * Contact-form email in the rich progress-self notification style: full
 * HTML document, colored header band, card body with a sender section and
 * message block, centered CTA button, responsive tweaks for tablet and
 * phone, plus an MSO font fallback — adapted to this site's tan accent.
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

  const sentAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const font = FONT_STACK;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${escapeHtml(subject)}</title>
<style type="text/css">
@media screen{body,table,td,p,a,span,strong,h1,h2,h3{font-family:${font}}}
/* Responsive: tablet (<=768px) */
@media only screen and (max-width:768px){
  .email-container{max-width:100%!important;margin:0 auto!important}
  .email-body{padding:20px 18px!important}
  .email-header{padding:20px!important}
  .email-header h1{font-size:19px!important}
}
/* Responsive: phone (<=480px) */
@media only screen and (max-width:480px){
  body{padding:12px!important}
  .email-container{max-width:100%!important;border-radius:8px!important}
  .email-header{padding:18px 16px!important;border-radius:8px 8px 0 0!important}
  .email-header h1{font-size:18px!important}
  .email-header p{font-size:12px!important}
  .email-body{padding:18px 14px!important;border-radius:0 0 8px 8px!important}
  .email-body p{font-size:14px!important}
  .email-cta{display:block!important;padding:12px 20px!important;font-size:13px!important}
}
</style>
<!--[if mso]>
<style type="text/css">body,table,td,p,a,span,strong,h1,h2,h3{font-family:Arial,sans-serif!important}</style>
<![endif]-->
</head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:${font}">
<div class="email-container" style="font-family:${font};max-width:560px;margin:0 auto;color:#1f2937;padding:0">
  <div class="email-header" style="background:${THEME_COLOR};color:#fff;padding:24px;text-align:center;border-radius:12px 12px 0 0">
    <h1 style="font-family:${font};margin:0;font-size:22px;font-weight:700">New Portfolio Message</h1>
    <p style="font-family:${font};margin:4px 0 0;font-size:13px;opacity:0.9">Contact form &bull; ${sentAt}</p>
  </div>
  <div class="email-body" style="background:#f9fafb;padding:28px 24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <p style="font-family:${font};margin:0 0 16px;font-size:15px">Hello,</p>
    <p style="font-family:${font};margin:0 0 20px;font-size:15px;line-height:1.6">You've received a new message through your portfolio contact form. Here are the details.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px" />
    <p style="font-family:${font};margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px">Sender</p>
    <table class="email-section-table" style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px">
      <tr><td style="padding:8px 0">
        <span style="display:inline-block;width:10px;height:10px;background:${THEME_COLOR};border-radius:50%;margin-right:8px;vertical-align:middle"></span>
        ${escapeHtml(payload.name)}<br/><span style="font-family:${font};color:#6b7280;font-size:12px"><a href="mailto:${escapeHtml(payload.email)}" style="color:${THEME_COLOR};text-decoration:none">${escapeHtml(payload.email)}</a></span>
      </td></tr>
    </table>
    <p style="font-family:${font};margin:0 0 8px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px">Message</p>
    <div style="background:#fff;border:1px solid #e5e7eb;border-left:3px solid #deb887;border-radius:6px;padding:14px 16px;margin:0 0 20px;font-size:15px;line-height:1.6">${messageToHtml(payload.message)}</div>
    <div style="text-align:center;margin:24px 0 16px">
      <a href="mailto:${escapeHtml(payload.email)}" class="email-cta" style="font-family:${font};display:inline-block;padding:12px 32px;background:${THEME_COLOR};color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Reply by email</a>
    </div>
    <p style="font-family:${font};margin:0 0 4px;font-size:14px;line-height:1.6">Replying to this email or using the button above reaches the sender directly.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0 12px" />
    <p style="font-family:${font};margin:0;font-size:13px;color:#6b7280;line-height:1.5">This message was sent automatically by your portfolio website.</p>
  </div>
</div>
</body>
</html>`;

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

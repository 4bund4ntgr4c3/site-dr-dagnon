const SITE_URL = 'https://seynudedagnon.com';

const COLORS = {
  pine950: '#0c2e2a',
  pine900: '#133e38',
  gold500: '#c9a24b',
  gold400: '#d4b36a',
  ivory: '#faf8f4',
  white: '#ffffff',
  ink: '#3a3a3a',
  muted: '#6b7280',
};

function wrapper(children: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:${COLORS.ivory};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.ivory};padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLORS.white};border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(12,46,42,0.08);">
${children}
</table>
<p style="margin:20px 0 0;font-size:11px;color:${COLORS.muted};text-align:center;">
  <a href="${SITE_URL}" style="color:${COLORS.gold500};text-decoration:none;">seynudedagnon.com</a>
</p>
</td></tr></table>
</body></html>`;
}

function header(title: string): string {
  return `<tr><td style="background:${COLORS.pine950};padding:28px 32px;">
  <table width="100%" cellpadding="0" cellspacing="0"><tr>
    <td>
      <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.12em;color:${COLORS.gold400};text-transform:uppercase;">Dr. Seynudé Dagnon</p>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;color:${COLORS.white};line-height:1.3;">${title}</h1>
    </td>
  </tr></table>
</td></tr>`;
}

function footer(): string {
  return `<tr><td style="background:${COLORS.pine900};padding:20px 32px;">
  <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);text-align:center;">
    Public Health &amp; Malaria Program Leader &middot; <a href="${SITE_URL}" style="color:${COLORS.gold400};text-decoration:none;">Website</a>
  </p>
</td></tr>`;
}

/* ── Admin notification (new message received) ──────────────────── */

export function adminNotificationHtml(name: string, email: string, subject: string, message: string): string {
  return wrapper(
    header('New message received') +
    `<tr><td style="padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="padding:10px 14px;background:${COLORS.ivory};border-radius:8px;border-left:3px solid ${COLORS.gold500};">
            <p style="margin:0;font-size:11px;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.08em;">From</p>
            <p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${COLORS.ink};">${name}</p>
            <p style="margin:2px 0 0;font-size:13px;color:${COLORS.muted};">${email}</p>
          </td>
        </tr>
      </table>
      ${subject ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="padding:10px 14px;background:${COLORS.ivory};border-radius:8px;border-left:3px solid ${COLORS.gold500};">
            <p style="margin:0;font-size:11px;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.08em;">Subject</p>
            <p style="margin:2px 0 0;font-size:14px;font-weight:600;color:${COLORS.ink};">${subject}</p>
          </td>
        </tr>
      </table>` : ''}
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:14px;background:${COLORS.ivory};border-radius:8px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:${COLORS.muted};text-transform:uppercase;letter-spacing:0.08em;">Message</p>
            <p style="margin:6px 0 0;font-size:14px;line-height:1.65;color:${COLORS.ink};white-space:pre-wrap;">${message}</p>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
        <tr><td align="center">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Your message')}" style="display:inline-block;background:${COLORS.gold500};color:${COLORS.pine950};font-size:13px;font-weight:600;padding:12px 28px;border-radius:999px;text-decoration:none;">Reply to ${name}</a>
        </td></tr>
      </table>
    </td></tr>` +
    footer()
  );
}

/* ── Auto-reply (thank you to sender) ──────────────────────────── */

export function autoReplyHtml(name: string, subject: string): string {
  return wrapper(
    header('Thank you for your message') +
    `<tr><td style="padding:28px 32px;">
      <p style="margin:0;font-size:14px;line-height:1.7;color:${COLORS.ink};">Dear <strong>${name}</strong>,</p>
      <p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${COLORS.ink};">
        Thank you for reaching out. I have received your message${subject ? ` regarding <strong>"${subject}"</strong>` : ''} and will get back to you as soon as possible.
      </p>
      <p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:${COLORS.ink};">
        In the meantime, feel free to explore my work:
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
        <tr>
          <td align="center" style="padding:4px;">
            <a href="${SITE_URL}/publications" style="display:inline-block;background:${COLORS.pine950};color:${COLORS.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:0.03em;">Publications</a>
          </td>
          <td align="center" style="padding:4px;">
            <a href="${SITE_URL}/media" style="display:inline-block;background:${COLORS.pine950};color:${COLORS.gold400};font-size:12px;font-weight:600;padding:10px 22px;border-radius:999px;text-decoration:none;letter-spacing:0.03em;">Media</a>
          </td>
        </tr>
      </table>
      <p style="margin:18px 0 0;font-size:14px;line-height:1.7;color:${COLORS.ink};">
        Best regards,<br>
        <strong>Dr. Seynudé Jean-Fortuné Dagnon</strong><br>
        <span style="font-size:13px;color:${COLORS.muted};">Public Health &amp; Malaria Program Leader</span>
      </p>
    </td></tr>` +
    footer()
  );
}

/* ── Verification code ─────────────────────────────────────────── */

export function verifyCodeHtml(code: string): string {
  return wrapper(
    header('Your verification code') +
    `<tr><td style="padding:28px 32px;">
      <p style="margin:0;font-size:14px;line-height:1.7;color:${COLORS.ink};">
        Use the code below to verify your identity and view the phone number on the contact page.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr><td align="center" style="padding:18px;background:${COLORS.ivory};border-radius:12px;border:2px dashed ${COLORS.gold500};">
          <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:0.25em;color:${COLORS.pine950};font-family:'Courier New',monospace;">${code}</p>
        </td></tr>
      </table>
      <p style="margin:0;font-size:13px;color:${COLORS.muted};text-align:center;">
        This code expires in <strong>5 minutes</strong>.
      </p>
      <p style="margin:14px 0 0;font-size:12px;color:${COLORS.muted};text-align:center;">
        If you didn't request this code, please ignore this email.
      </p>
    </td></tr>` +
    footer()
  );
}

/* ── Plain text fallbacks ──────────────────────────────────────── */

export function adminNotificationText(name: string, email: string, subject: string, message: string): string {
  return `New message from ${name} <${email}>${subject ? `\nSubject: ${subject}` : ''}\n\n${message}`;
}

export function autoReplyText(name: string): string {
  return `Dear ${name},\n\nThank you for reaching out. I have received your message and will get back to you as soon as possible.\n\nBest regards,\nDr. Seynudé Jean-Fortuné Dagnon\nPublic Health & Malaria Program Leader\nhttps://seynudedagnon.com`;
}

export function verifyCodeText(code: string): string {
  return `Your verification code is: ${code}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`;
}

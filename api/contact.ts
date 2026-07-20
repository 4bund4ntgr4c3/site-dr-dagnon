/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
    if (!apiKey || !to) {
      res.status(500).json({ error: 'Email service not configured' });
      return;
    }
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio contact — ${subject || name}`,
        text: `New message from ${name} <${email}>:\n\n${message}`,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      console.error('Resend error', err);
      res.status(500).json({ error: 'Failed to send' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
}

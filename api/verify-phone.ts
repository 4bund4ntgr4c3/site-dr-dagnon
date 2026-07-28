const codeStore = new Map<string, { code: string; expiresAt: number }>();
const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CODE_LENGTH = 6;

function generateCode(): string {
  return Array.from({ length: CODE_LENGTH }, () => Math.floor(Math.random() * 10)).join('');
}

function cleanup() {
  const now = Date.now();
  for (const [key, val] of codeStore) {
    if (now > val.expiresAt) codeStore.delete(key);
  }
}

interface VerifyRequest {
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: { action?: string; email?: string; code?: string };
}

interface VerifyResponse {
  status: (code: number) => VerifyResponse;
  json: (data: unknown) => void;
}

export default async function handler(req: VerifyRequest, res: VerifyResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { action, email, code } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  const cleanEmail = String(email).toLowerCase().trim();

  if (action === 'send') {
    cleanup();

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <admin@seynudedagnon.com>';
    if (!apiKey) {
      res.status(500).json({ error: 'Email service not configured' });
      return;
    }

    const verificationCode = generateCode();
    codeStore.set(cleanEmail, { code: verificationCode, expiresAt: Date.now() + CODE_TTL_MS });

    const subject = 'Your verification code — Seynudé Dagnon';
    const body = `Your verification code is: ${verificationCode}\n\nThis code expires in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`;

    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [cleanEmail],
          subject,
          text: body,
        }),
      });
      if (!r.ok) {
        const err = await r.text();
        console.error('Resend verify error', err);
        res.status(500).json({ error: 'Failed to send code' });
        return;
      }
      res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
    return;
  }

  if (action === 'verify') {
    cleanup();

    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Missing code' });
      return;
    }

    const entry = codeStore.get(cleanEmail);
    if (!entry) {
      res.status(400).json({ error: 'No code requested' });
      return;
    }
    if (Date.now() > entry.expiresAt) {
      codeStore.delete(cleanEmail);
      res.status(400).json({ error: 'Code expired' });
      return;
    }
    if (entry.code !== code.trim()) {
      res.status(400).json({ error: 'Invalid code' });
      return;
    }

    codeStore.delete(cleanEmail);
    res.status(200).json({ ok: true });
    return;
  }

  res.status(400).json({ error: 'Invalid action' });
}

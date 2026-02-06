import { reader } from '@/lib/keystatic';
import { defaultSettings, type SiteSettings } from '@/lib/site';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
});

function formatMessage(input: z.infer<typeof schema>) {
  return [
    `New message from portfolio contact form`,
    ``,
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    ``,
    input.message,
  ].join('\n');
}

export async function POST(req: Request) {
  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) {
    return new Response('Invalid payload', { status: 400 });
  }

  const raw = (await reader.singletons.settings.read()) as Partial<SiteSettings> | null;
  const settings = { ...defaultSettings, ...(raw ?? {}) } as SiteSettings;

  const text = formatMessage(body.data);

  if (settings.contact.discriminant === 'telegram') {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = settings.contact.value.chatId;
    if (!token || !chatId) return new Response('Telegram is not configured', { status: 500 });

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!res.ok) return new Response('Failed to send telegram message', { status: 502 });
    return Response.json({ ok: true });
  }

  const to = settings.contact.value.to;
  if (!to) return new Response('SMTP is not configured', { status: 500 });

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !port || !user || !pass || !from) {
    return new Response('SMTP env is not configured', { status: 500 });
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({
    from,
    to,
    subject: `Portfolio message from ${body.data.name}`,
    text,
    replyTo: body.data.email,
  });

  return Response.json({ ok: true });
}



'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  message: z.string().min(1).max(5000),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    defaultValues: { name: '', email: '', message: '' },
  });

  return (
    <form
      className="grid gap-3"
      onSubmit={handleSubmit(async (values) => {
        setStatus('sending');
        setErrorMsg('');

        const parsed = schema.safeParse(values);
        if (!parsed.success) {
          setStatus('error');
          setErrorMsg('Проверьте поля формы.');
          return;
        }

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(parsed.data),
          });
          if (!res.ok) throw new Error(await res.text());
          setStatus('sent');
          reset();
        } catch (e: unknown) {
          setStatus('error');
          setErrorMsg(e instanceof Error ? e.message : 'Не удалось отправить сообщение.');
        }
      })}
    >
      <input
        className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/35"
        placeholder="Имя"
        {...register('name', { required: true })}
      />
      <input
        className="glass w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/35"
        placeholder="Email"
        type="email"
        {...register('email', { required: true })}
      />
      <textarea
        className="glass min-h-[140px] w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/35"
        placeholder="Сообщение"
        {...register('message', { required: true })}
      />

      <button
        type="submit"
        disabled={status === 'sending' || formState.isSubmitting}
        className="glass mt-2 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? 'Отправка…' : 'Отправить'}
      </button>

      {status === 'sent' ? <div className="text-sm text-muted">Сообщение отправлено.</div> : null}
      {status === 'error' ? <div className="text-sm text-red-300">{errorMsg || 'Ошибка отправки.'}</div> : null}
    </form>
  );
}



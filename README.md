# Finanças — controle financeiro pessoal

Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth + Postgres/RLS) + Recharts.

## Rodando
1. Crie um projeto no Supabase e execute `supabase/schema.sql` no SQL Editor.
2. Copie `.env.local.example` para `.env.local` e preencha URL e anon key (Project Settings → API).
3. (Opcional, para testar rápido) Em Authentication → Providers → Email, desligue "Confirm email".
4. `npm install && npm run dev` → http://localhost:3000

## Deploy
Suba para o GitHub e importe na Vercel, definindo as duas variáveis de ambiente `NEXT_PUBLIC_SUPABASE_*`.

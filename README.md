# Finanças — controle financeiro pessoal

Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth + Postgres/RLS) + Recharts.

## Rodando
1. Crie um projeto no Supabase e execute `supabase/schema.sql` no SQL Editor.
2. Copie `.env.local.example` para `.env.local` e preencha URL e anon key (Project Settings → API).
3. (Opcional, para testar rápido) Em Authentication → Providers → Email, desligue "Confirm email".
4. `npm install && npm run dev` → http://localhost:3000

## Deploy na Vercel
1. Importe o repositório do GitHub na Vercel (framework: Next.js, detectado automaticamente).
2. Em Settings → Environment Variables, defina para Production e Preview:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave *publishable*)
3. No Supabase, em Authentication → URL Configuration, defina **Site URL** com o domínio da Vercel e adicione-o (e `https://*-seu-time.vercel.app/**` para previews) em **Redirect URLs**.
4. Faça o deploy.

## Segurança
- Só a chave **publishable/anon** é usada no frontend. **Nunca** use a `service_role` key nem a connection string do banco no app ou em variáveis `NEXT_PUBLIC_*`.
- O acesso aos dados é protegido por Row Level Security (`supabase/schema.sql`): cada usuário só lê e altera as próprias transações. Confirme que o RLS está ativo na tabela antes de publicar.
- `.env*` está no `.gitignore`; apenas `.env.local.example` (sem segredos) é versionado.
- `next.config.ts` aplica cabeçalhos de segurança (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).
- Rotas privadas são protegidas em `src/proxy.ts` validando o usuário com `supabase.auth.getUser()`.
- Em produção, mantenha "Confirm email" ligado no Supabase Auth e considere aumentar o tamanho mínimo da senha.

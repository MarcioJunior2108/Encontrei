# Guia de Configuração do Ambiente (.env)

O arquivo `.env.local` é essencial para o funcionamento completo da aplicação AcheiYou, quando conectada ao backend real. Na Fase de UI (mockada), as variáveis não são estritamente necessárias, mas caso configuradas, o sistema usará as chaves correspondentes.

## Supabase (Banco de Dados e Auth)
Necessário para autenticação, perfis de usuário, criação de pedidos de serviços e chat.

- `NEXT_PUBLIC_SUPABASE_URL`: A URL do seu projeto Supabase (ex: `https://xyz.supabase.co`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública/anônima. **Pode** ser exposta no client-side. Usada para chamadas SSR (Server-Side Rendering) e CSR (Client-Side Rendering) autenticadas via JWT.
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de administrador (Service Role). **NUNCA** exponha no frontend (não comece com `NEXT_PUBLIC_`). Usada em rotas de API (`/api/admin`) para operações privilegiadas (banimento, suspensão, leitura bruta de logs).

## Stripe (Pagamentos)
Gerencia recebimento do cliente e split de pagamentos (Stripe Connect) com os profissionais.

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe, usada pelo Elements (UI do cartão).
- `STRIPE_SECRET_KEY`: Chave privada do Stripe, usada em rotas `/api/checkout` e webhooks.
- `STRIPE_WEBHOOK_SECRET`: Segredo de assinatura de webhooks, usado para validar se o evento de pagamento veio realmente do Stripe.

## OpenAI (Inteligência Artificial)
Necessário para o **Intent Engine**, responsável por traduzir textos soltos em requisições estruturadas e formatar a taxonomia de serviços de forma inteligente.

- `OPENAI_API_KEY`: Chave secreta da OpenAI (projetada para uso com os modelos gpt-4o-mini ou gpt-4o). Usada apenas nas rotas de API do servidor.

## Monitoramento (Sentry & PostHog)
Para rastreamento de erros de runtime e métricas comportamentais (Analytics).

- `NEXT_PUBLIC_POSTHOG_KEY`: Chave pública do projeto no Posthog (Analytics).
- `NEXT_PUBLIC_POSTHOG_HOST`: Geralmente `https://us.i.posthog.com`.
- `NEXT_PUBLIC_SENTRY_DSN`: O DSN do Sentry para capturar erros no browser e no edge/node.

---

**⚠️ ALERTA DE SEGURANÇA**
Nunca adicione o arquivo `.env.local`, `.env.production` ou `.env` no git commit. Eles já estão no `.gitignore` por padrão. Para chaves que os desenvolvedores precisam preencher sozinhos, altere apenas o arquivo `.env.example`.

# PROJECT_BLUEPRINT.md — Encontrei

> **"Transformar intenção humana em ação."**

---

## Visão

O usuário não precisa entender categorias, menus ou sistemas complexos.
Ele simplesmente diz o que precisa — e a plataforma encontra, organiza, compara e resolve.

Conceito central: **INTENÇÃO → INTELIGÊNCIA → SOLUÇÃO → TRANSAÇÃO**

---

## Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR, RSC, performance |
| Linguagem | TypeScript strict | Segurança de tipos |
| Estilo | Tailwind CSS v4 | Utility-first, tokens CSS |
| Componentes | shadcn/ui + custom | Acessível, extensível |
| Animações | Framer Motion | Microinterações |
| Estado server | TanStack Query | Cache, revalidação |
| Estado global | Zustand | Mínimo e preciso |
| Formulários | React Hook Form + Zod | Validação segura |
| Backend/DB | Supabase + PostgreSQL | Auth, Realtime, Storage |
| Deploy | Vercel + Supabase | Edge, CDN, zero-config |

---

## Estrutura de Módulos

```
features/
  auth/          Autenticação, sessão, RBAC
  users/         Perfis, preferências
  professionals/ Cadastro, disponibilidade, serviços
  requests/      Intenção, matching, status
  reputation/    Score, avaliações, badges
  notifications/ Central, preferências, templates
  analytics/     Acquisition, Activation, Retention, Revenue
  admin/         Console, moderação, audit logs
  payments/      (Fase 7) Transações, split, relatórios
```

---

## Rotas

| Rota | Descrição |
|---|---|
| `/` | Home — Hero com IntentInput |
| `/buscar` | Resultados de busca |
| `/perfil/[id]` | Perfil do profissional |
| `/login` | Login |
| `/cadastro` | Cadastro |
| `/onboarding` | Fluxo de onboarding |
| `/dashboard` | Dashboard do usuário |
| `/profissional` | Portal do profissional |
| `/admin` | Admin Console — Overview |
| `/admin/usuarios` | Gestão de usuários |
| `/admin/profissionais` | Gestão de profissionais |
| `/admin/solicitacoes` | Solicitações |
| `/admin/transacoes` | Transações |
| `/admin/analytics` | Analytics |
| `/admin/moderacao` | Moderação |
| `/admin/audit-logs` | Audit logs |
| `/admin/configuracoes` | Configurações |
| `/share/[id]` | Compartilhamento viral |

---

## Banco de Dados (Supabase/PostgreSQL)

### Tabelas Principais

```sql
users               -- auth.users + perfil
profiles            -- dados estendidos do usuário
professionals       -- dados do profissional
professional_services -- serviços oferecidos
service_categories  -- taxonomia de categorias
requests            -- solicitações de serviço
request_matches     -- matches usuário ↔ profissional
bookings            -- agendamentos confirmados
transactions        -- movimentações financeiras
payments            -- detalhes de pagamento
reviews             -- avaliações
reputation_scores   -- scores calculados
notifications       -- notificações
messages            -- mensagens entre partes
reports             -- denúncias
admin_users         -- usuários administrativos
admin_roles         -- papéis e permissões
audit_logs          -- log de ações administrativas
analytics_events    -- eventos de produto
referral_codes      -- sistema de indicação
```

### Segurança
- Row Level Security (RLS) obrigatório em todas as tabelas
- Princípio do menor privilégio por papel (PUBLIC, USER, PROFESSIONAL, ADMIN, SUPER_ADMIN)
- Service role key: apenas server-side
- Políticas explícitas para SELECT, INSERT, UPDATE, DELETE

---

## Design System

### Tokens de Cor
```
--primary:          Índigo (243 75% 59%)
--background:       Branco / Quase-preto
--foreground:       Quase-preto / Branco
--muted:            Cinza frio suave
--border:           Cinza frio 90%
--success:          Verde (142 71% 45%)
--warning:          Âmbar (38 92% 50%)
--error:            Vermelho (0 84% 60%)
--info:             Azul-ciano (199 89% 48%)
```

### Tipografia
- Família: Geist Sans (Google Fonts)
- Mono: Geist Mono
- Hierarquia: 7xl → text-[10px]

### Componentes
- Button (7 variantes, 8 tamanhos)
- Card + CardHeader/Content/Footer
- Badge (7 variantes semânticas)
- Avatar (6 tamanhos + badge de verificação)
- Skeleton / SkeletonCard / SkeletonText / SkeletonMetricCard
- IntentInput (componente central)

---

## Roadmap

### ✅ Fase 1 — Foundation (atual)
- Next.js 16 + TypeScript + Tailwind v4
- Design system completo
- Layouts responsivos
- Mock data realista

### ✅ Fase 2 — Core UX (atual)
- Home com IntentInput
- Busca com filtros
- Perfil profissional
- Cards de resultado

### 🔄 Fase 3 — Auth Real
- Supabase Auth integrado
- Login email/password
- Google OAuth
- Onboarding

### 📋 Fase 4 — Admin Completo
- Analytics real
- Moderação funcional
- Audit logs persistidos
- Realtime com Supabase

### 📋 Fase 5 — PWA
- Service Worker
- Push notifications
- Offline fallback
- App install

### 📋 Fase 6 — Backend Real
- Requests CRUD
- Matching algorithm
- Reputation engine
- Notifications

### 📋 Fase 7 — Payments
- PIX integration
- Split payments
- Escrow
- Relatórios fiscais

---

## Decisões de Arquitetura

1. **Modular Monolith** — organizado por domínio, sem microservices prematuros
2. **Mock → Real** — interfaces e contratos definidos antes da integração
3. **Security First** — RLS, menor privilégio, audit logs desde o início
4. **Mobile First** — 360px → 390px → 430px → 768px → 1440px+
5. **Performance** — RSC onde possível, lazy loading, otimização de imagens

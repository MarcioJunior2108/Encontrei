# Encontrei 🎯

A plataforma que transforma **intenção humana em ação**. O Encontrei não é apenas mais um diretório de profissionais — é um motor de busca semântico focado em conectar sua necessidade com as pessoas certas, na hora certa.

![Next.js](https://img.shields.io/badge/Next.js-16.x-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.x-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)

## 🌟 O Projeto

O **Encontrei** foi construído com uma premissa clara: **design excepcional e facilidade de uso extrema**. 
Em vez de forçar o usuário a preencher formulários complexos, ele apenas digita o que quer (*"Preciso de alguém para consertar meu telhado urgente"*), e o sistema cuida do resto, fazendo o match perfeito.

### 🎨 Design System
- **Arquitetura Visual**: Baseado em tokens CSS globais (HSL) para total flexibilidade.
- **Componentes**: Construídos em cima do Radix UI (shadcn) para acessibilidade (A11y) perfeita.
- **Estética**: Inspirada em Stripe, Linear e Apple. Uso intensivo de glassmorphism, micro-animações (Framer Motion) e dark mode nativo de alta precisão.

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/encontrei.git
cd encontrei
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente baseadas no `.env.example`:
```bash
cp .env.example .env.local
```
*(Consulte `ENVIRONMENT.md` para detalhes sobre as chaves).*

4. Inicie o servidor de desenvolvimento (Turbopack):
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 🏗 Estritetura de Arquitetura

O projeto utiliza um **Monólito Modular** focado no frontend robusto:

- **`/src/app`**: O coração do Next.js App Router (Páginas, Layouts, API Routes).
- **`/src/components`**: Peças de LEGO da UI, categorizadas em `ui/`, `layout/`, `home/`, `admin/`, etc.
- **`/src/mock`**: Motor de dados mockados hiper-realista que simula o backend completo para demonstrações de UI (inclui centenas de usuários, transações e lógicas interconectadas).
- **`/src/lib`**: Utilitários (como clsx/tailwind-merge) e clientes (como Supabase SSR config).

*(Para uma visão profunda do roadmap, esquema de banco de dados e visão de produto, leia o arquivo `PROJECT_BLUEPRINT.md` no painel de artefatos).*

## 📱 PWA (Progressive Web App)

O Encontrei já está pronto para ser instalado nativamente via navegadores suportados (Chrome/Safari), contando com `manifest.json` robusto e um *Service Worker* para fallback offline básico.

---
Feito com 🖤 para escalar.

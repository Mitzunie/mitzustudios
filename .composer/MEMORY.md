# MEMORY — mitzustudios-portfolio

> Última actualización: 2026-06-20 00:45 (por composer)
> Para retomar: lee este archivo + `.composer/state.json` + `git log --oneline -10`

## Estado actual
- **Fase:** architect completada — esperando aprobación humana [GATE 👤]
- **Próxima fase:** coder (3/7)
- **Feature:** MitzuStudios Portfolio
- **Branch:** master (1 commit — specs commiteadas, architecture.md sin commitear)

## Lo que se hizo (cronológico, último primero)

### 2026-06-20 00:50 — composer: D-01 refinado con página de registro temporal
- Usuario quiere crear los 3 admins desde UI (no seed)
- Se añadió:
  - Página `/register` temporal con formulario (nombre, email, password)
  - Endpoint `POST /api/auth/register` temporal
  - Después de crear los 3 admins, Mitzu eliminará ambos del código
  - Login normal permanente en `/admin/login`
- El middleware protege `/admin/*` y verifica email en ADMIN_EMAILS
- D-02 a D-10 sin cambios

### 2026-06-20 00:30 — architect: architecture.md generado
- 10 decisiones arquitectónicas (D-01 a D-10)
- 1382 líneas de diseño completo
- Prisma schema, API routes, componentes, flujos de datos, i18n, tema, seguridad
- Mapeo completo de 40 specs a archivos y componentes
- Variables de entorno validadas con @t3-oss/env-nextjs + Zod
- Dependencias listadas con versiones referenciales

### 2026-06-20 00:22 — git-keeper: commit inicial de specs
- `6e0ddd3` `docs(specs): especificaciones completas del portfolio MitzuStudios`
- 11 archivos, 802 líneas añadidas
- Cubre: specs.md, 8 feature files BDD, MEMORY.md, state.json
- Branch: master (root commit, no pusheado)

### 2026-06-20 00:10 — spec-analyst: Iteración #3 — SEO eliminado
- Eliminados SF-31 (meta/OG/sitemap), SNF-10, SNF-11, CA-16
- Eliminado escenario BDD en landing.feature
- Renumeración posterior de SF/SNF/CA
- Resultado: **40 SF, 10 SNF, 10 RN, 12 CB, 21 CA**

### 2026-06-20 00:00 — spec-analyst: Iteración #2 — Decisiones finales aplicadas
- Select Tipo Proyecto con opciones + "Otro" con textbox
- WhatsApp integrado: al crear solicitud → notificación a PYME + mensaje al cliente
- Admin responde cotizaciones vía WhatsApp o Email (selector de canal)
- 3 admins vía variables de entorno
- Estados proyecto: publicado / oculto / borrador
- Imagen de proyecto opcional (placeholder si no hay)
- GitHub links opcionales
- i18n solo textos/labels
- Google Analytics solo en producción
- Resultado: **41 SF, 12 SNF, 10 RN, 12 CB, 22 CA**

### 2026-06-19 23:18 — spec-analyst + composer: Iteración #1 — Specs generadas
- 32 SF, 12 SNF, 9 CB, 7 RN, 16 CA
- 8 archivos .feature con 35 escenarios BDD
- Preguntas de refinamiento al usuario

### 2026-06-19 23:18 — composer: preflight completado
- Stack confirmado con el usuario:
  - Next.js 16 (App Router) + React 19 como todo-en-uno (frontend + API routes)
  - Tailwind CSS v4 + shadcn/ui para estilos
  - Zustand para estado cliente
  - React Hook Form para formularios
  - Prisma + PostgreSQL serverless (Neon/Supabase)
  - Auth.js (NextAuth v5) con email+password
  - Resend para emails transaccionales
  - Cloudinary para storage de imágenes
  - Vitest para testing
  - Turborepo + pnpm workspaces como monorepo
  - Todo deployado en Vercel
- Panel admin con login para gestionar solicitudes de servicios y proyectos publicados
- Seguridad: Prisma parameterized queries, Auth.js bcrypt, rate limiting, Zod validation

## Lo que falta

### Gate de aprobación 👤 (pendiente)
- [ ] Usuario debe aprobar architecture.md (D-01 corregido)
- [ ] Tras aprobación: commit via git-keeper + pasar a coder

### Fase 3 — coder (próxima tras aprobación)
- [ ] Inicializar monorepo (Turborepo + pnpm workspaces)
- [ ] Configurar packages/db con Prisma schema + seed
- [ ] Configurar apps/web con Next.js 16 + shadcn/ui
- [ ] Implementar landing page (Hero, About, Services, Projects, Contact)
- [ ] Implementar formulario de contacto + API route
- [ ] Implementar Auth.js + User model + seed admins
- [ ] Implementar panel admin (layout protegido)
- [ ] Implementar CRUD proyectos + subida Cloudinary
- [ ] Implementar gestión de solicitudes + responder WhatsApp/Email
- [ ] Implementar i18n es/en
- [ ] Implementar tema claro/oscuro
- [ ] Implementar animaciones (IntersectionObserver + CSS)
- [ ] Implementar Google Analytics

### Fases pendientes
- tester, reviewer, ci-cd, release-manager

## Decisiones pendientes del usuario
- Ninguna pendiente ahora.

## Notas de contexto recuperable
- **Estilo:** Neo-Brutalismo con morados oscuros (#5A189A, #3C096C gama). Toggle claro/oscuro (default dark). Animaciones sutiles y llamativas.
- **Formulario contacto:** Nombre, Email, Teléfono, Tipo Proyecto (select: Landing/Tienda/Web App/API/Rediseño/Otro+textbox), Descripción. Al enviar: guardar DB + WhatsApp PYME + aviso al cliente.
- **Admin:** 3 usuarios vía env vars (emails autorizados). Login email+password (Auth.js). Panel: solicitudes (ver, responder WhatsApp/Email, cambiar estado), proyectos (CRUD, cambiar estado publicado/oculto/borrador, subir imagen Cloudinary).
- **WhatsApp:** Integración con API WhatsApp Business o Twilio para enviar notificaciones al número PYME y respuestas al cliente.
- **Email:** Resend para notificaciones. Email admin oculto en env vars.
- **Almacenamiento:** Cloudinary para imágenes.
- **Analytics:** Google Analytics solo en producción.
- **Idioma:** Español/Inglés toggle (solo labels, no rutas).
- **Responsive:** Todos los dispositivos.
- **Sin SEO.**
- Dominio: mitzustudios.online

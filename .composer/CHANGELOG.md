# Changelog

Todos los cambios notables de este proyecto se documentan aquí.
Sigue [Keep a Changelog](https://keepachangelog.com/) y [Semantic Versioning](https://semver.org/).

## [v1.0.0] — 2026-06-20

### ✨ Features

- **Landing page completa** con 5 secciones: Hero, Sobre Mí, Servicios, Proyectos y Contacto. Diseño Neo-Brutalismo con paleta morada oscura y animaciones sutiles al hacer scroll.
- **Formulario de contacto** con campos validados (Zod): nombre, email, teléfono, tipo de proyecto (select con "Otro" que revela campo de texto) y descripción. Al enviar guarda en DB, envía notificación por email (Resend) y WhatsApp a la PYME.
  - Specs: SF-06, SF-07, SF-08, SF-09, SF-32, SF-33, SF-34
  - Endpoints: `POST /api/contact`
- **Galería de proyectos** con tarjetas que muestran título, descripción, imagen (Cloudinary) y tecnologías con iconos. Solo proyectos publicados son visibles.
  - Specs: SF-11, SF-12, SF-35
- **Panel administrador** completo con autenticación (Auth.js v5 + email/password):
  - Login con rate limiting anti-fuerza bruta
  - Solo 3 usuarios autorizados configurados por variable de entorno
  - Dashboard, CRUD de proyectos, gestión de solicitudes
  - Specs: SF-13 a SF-17, SF-22 a SF-26, SF-38 a SF-40
- **CRUD de proyectos** desde el panel: crear, editar, eliminar proyectos con estados (publicado/oculto/borrador), subida de imágenes a Cloudinary, filtrado por estado.
  - Endpoints: `GET/POST /api/admin/projects`, `GET/PATCH/DELETE /api/admin/projects/[id]`, `POST /api/upload`
- **Gestión de solicitudes de contacto** desde el panel: listado completo, marcar como leída/no leída, filtrar por estado, responder por WhatsApp o Email con registro en DB.
  - Endpoints: `GET /api/admin/requests`, `GET/PATCH /api/admin/requests/[id]`, `POST /api/admin/requests/[id]/respond`
- **Registro temporal de administradores** en `/register` (se eliminará tras el setup inicial).
- **Sistema de i18n** español/inglés con Zustand, toggle de idioma sin cambio de rutas.
  - Spec: SF-30
- **Tema oscuro/claro** con toggle manual, modo oscuro por defecto, persistencia en localStorage.
  - Spec: SF-27
- **Google Analytics** (GA4) cargado solo en producción.
  - Spec: SF-31
- **Diseño responsive** para todos los viewports (320px a 2560px) con navegación operable por teclado y HTML semántico.
  - Specs: SF-29, SNF-09, SNF-10

### 🐛 Fixes

- **Seguridad**: email hardcodeado en Footer reemplazado por variable de entorno `NEXT_PUBLIC_CONTACT_EMAIL`.
  - Specs: B-01, SNF-07, RN-05
- **Middleware admin**: ahora verifica `ADMIN_EMAILS` antes de permitir acceso a rutas `/admin/*`.
  - Specs: B-02, D-01, SNF-08, SF-14
- **Rate limiter login**: extrae IP real desde headers `x-forwarded-for` y `x-real-ip` en vez de usar IP hardcodeada.
  - Specs: B-03, SF-17, SNF-05
- **Servicio duplicado** en el Footer eliminado.

### ⚡ Performance

- **Rate limiting LRU** en memoria para endpoints `/api/contact` y login.
  - Specs: SF-10, SNF-05, CB-06
- **Paginación** en listados de proyectos y solicitudes del panel admin.

### 🔒 Seguridad

- Autenticación con Auth.js v5 + PrismaAdapter, contraseñas hasheadas con bcrypt.
  - Spec: SNF-03
- Todas las consultas a DB usan Prisma parameterized queries (protección SQL injection).
  - Spec: SNF-04
- Todos los inputs de API validados con Zod antes de procesar.
  - Spec: SNF-06
- Variables de entorno para datos sensibles (emails, API keys, credenciales), nunca en código.
  - Specs: SNF-07, RN-01, RN-05
- Rate limiting activo en formulario de contacto y endpoints de autenticación.
  - Specs: SNF-05, CB-06
- Middleware protege rutas `/admin/*` redirigiendo a login si no hay sesión.
  - Spec: SNF-08

### 🔧 Internal

- Monorepo con Turborepo + pnpm workspaces.
- Next.js 16 App Router con API routes.
- Prisma ORM con PostgreSQL serverless (Neon/Supabase).
- shadcn/ui components + Tailwind CSS v4.
- Suite de 138 tests unitarios y de integración (Vitest).
- CI/CD: GitHub Actions (CI build+lint+test + deploy manual a Vercel).
- Docker dev environment: Postgres 16 + Redis 7.
- Cobertura de 40 specs funcionales y 10 no funcionales, 12 casos borde, 21 criterios de aceptación.

# Arquitectura — MitzuStudios Portfolio

> Generado por architect el 2026-06-20. Iteración #1.
> Basado en .composer/specs.md (versión 2026-06-20).
> Decisiones del compositor + respuestas del usuario aplicadas.

## Estado del repo al inicio

```
Cero código de aplicación.
Solo existe .composer/ (specs, features, state, memory).
No hay package.json, tsconfig, prisma/ ni src/.
```

## Stack aplicado a este feature

| Capa           | Tech                                         | Razón                                                  |
| -------------- | -------------------------------------------- | ------------------------------------------------------ |
| Frontend       | Next.js 16 (App Router)                      | Framework todo-en-uno, API routes + RSC                |
| UI             | shadcn/ui + Tailwind CSS v4                  | Componentes accesibles, dark mode nativo               |
| Estado cliente | Zustand                                      | Ligero, persist middleware para tema/idioma            |
| Formularios    | react-hook-form + @hookform/resolvers/zod    | Validación cliente/servidor unificada                  |
| ORM            | Prisma                                       | Tipado fuerte, migrations, serverless-friendly         |
| DB             | PostgreSQL (Neon serverless)                 | Escalable, compatible Prisma                           |
| Auth           | Auth.js (NextAuth v5) — Credentials provider | JWT stateless, sin dependencia de DB                   |
| Email          | Resend                                       | API simple, SDK moderno, React email templates         |
| Storage        | Cloudinary                                   | Upload server-side, optimización automática            |
| Hosting        | Vercel                                       | Edge network, dominio `mitzustudios.online` apuntado   |
| Monorepo       | Turborepo + pnpm workspaces                  | Escalabilidad futura (packages/db, packages/shared)    |
| Testing        | Vitest                                       | Rápido, compatible Vite, usado en ecosistema Turborepo |
| Analytics      | Google Analytics v4 (GA4)                    | Solo producción, page views + evento contacto          |

## Decisiones arquitectónicas

### D-01: Auth.js con Credentials provider + User model + Prisma Adapter

- **Elegido:** Auth.js v5 con provider `Credentials`, sesión JWT y **Prisma Adapter** para persistir usuarios en DB. Se crea un modelo `User` en Prisma y se usa `@auth/prisma-adapter`. Los 3 emails administradores se configuran en variable de entorno `ADMIN_EMAILS`. La contraseña de cada admin se almacena hasheada con bcrypt en la DB. El middleware de Auth.js protege las rutas `/admin/*` y además verifica que el email del usuario autenticado esté en `ADMIN_EMAILS`. Cualquier usuario puede registrarse, pero **solo los 3 emails en `ADMIN_EMAILS` tienen acceso al panel admin**.
- **Registro de admins:** Se incluye una **página de registro público** (`/register`) con endpoint `POST /api/auth/register`. El usuario Mitzu usará esta página para crear sus 3 cuentas admin. **Después de crear las cuentas, Mitzu eliminará la página de registro y el endpoint del proyecto.** Esto es intencional — no se quiere permitir registro público en producción.
- **Razón:** El usuario pidió crear él mismo a los administradores desde la UI en lugar de usar seed script. La página de registro es temporal (solo para setup inicial). Una vez creados los 3 admins, se elimina del código.
- **Estructura:**
  1. Modelo `User` en Prisma (id, name, email, password, createdAt)
  2. Auth.js con PrismaAdapter + Credentials provider
  3. Página `/register` con formulario (nombre, email, password, confirmar password) — **temporal, se elimina tras crear los 3 admins**
  4. Endpoint `POST /api/auth/register` — crea usuario en DB con bcrypt — **temporal, se elimina junto con la página**
  5. Middleware protege `/admin/*` + verifica email en `ADMIN_EMAILS`
  6. Login normal en `/admin/login` (permanente)
- **Alternativa descartada:** Seed script — el usuario prefiere crear los admins desde la UI.
- **Trade-off aceptado:** La página de registro queda expuesta públicamente durante el setup inicial. Se eliminará manualmente después. Mientras exista, cualquiera puede registrarse (pero solo los emails en ADMIN_EMAILS acceden al panel).
- **Spec relacionada:** SF-13, SF-14, SF-16, SF-17

### D-02: WhatsApp mediante wa.me links (sin API Twilio/WhatsApp Business)

- **Elegido:** No hay API de WhatsApp. El panel admin genera links `wa.me` con los datos codificados en URL. El admin los abre manualmente para:
  - Notificar a la PYME sobre nueva solicitud
  - Responder al cliente
- **Razón:** El usuario descartó explícitamente Twilio y WhatsApp Business API. wa.me links son gratuitos, no requieren configuración de API keys, y cumplen el propósito (el admin ve los datos precargados y solo confirma el envío).
- **Alternativa descartada:** Twilio WhatsApp API — costos recurrentes, requiere número registrado, configuración adicional. WhatsApp Business API — requiere aprobación de Meta, onboarding complejo.
- **Trade-off aceptado:** El envío no es automático. El admin debe hacer clic manualmente. La respuesta del admin se registra en DB antes de abrir el link (best-effort).
- **Spec relacionada:** SF-33, SF-36, CB-10

### D-03: Subida de imágenes a Cloudinary en un solo paso (integrada en formulario de proyecto)

- **Elegido:** El formulario de proyecto (crear/editar) incluye el campo de imagen. Al enviar el formulario, el servidor recibe el archivo como `multipart/form-data`, lo sube a Cloudinary, obtiene la URL, y guarda el proyecto con esa URL. Todo en una sola petición.
- **Razón:** El usuario eligió expresamente la opción B. Simplifica el UX del admin (un solo envío, no hay que subir imagen aparte). La imagen sigue siendo opcional (SF-22, RN-02).
- **Alternativa descartada:** Opción A (subir imagen primero, luego crear proyecto). Opción C (pre-signed URL desde el cliente).
- **Trade-off aceptado:** El endpoint del proyecto debe aceptar `multipart/form-data` en vez de JSON puro. La validación Zod debe hacerse con `zod-form-data` o parsear el FormData manualmente.
- **Spec relacionada:** SF-22, SF-23, SF-25, CB-03, CB-11

### D-04: Rate limiting con LRU Cache en memoria

- **Elegido:** Implementación propia con un Map que almacena contadores por IP + timestamp de expiración. Sin Redis, sin dependencias externas.
- **Razón:** El usuario lo confirmó como suficiente para MVP. El portfolio no tendrá alto tráfico. LRU en memoria es simple y no añade latencia de red.
- **Alternativa descartada:** `@upstash/ratelimit` + Redis — requería Redis externo, añadía complejidad y costo. `@nestjs/throttler` — no aplica porque no hay NestJS.
- **Trade-off aceptado:** En serverless (Vercel), cada instancia tiene su propio Map. Una IP podría exceder el límite en una instancia y no en otra. Aceptable para MVP con tráfico bajo.
- **Spec relacionada:** SF-10, SF-17, SNF-05, CB-06

### D-05: i18n con Zustand + diccionarios planos (sin next-intl ni react-intl)

- **Elegido:** Diccionarios ES/EN en `packages/shared/src/i18n/`. Un hook `useTranslations()` que lee el idioma desde Zustand (persistido en localStorage) y devuelve el diccionario correspondiente. Las traducciones se aplican solo a labels/textos, no a rutas.
- **Razón:** SF-30 dice explícitamente que el toggle solo cambia textos/labels y no modifica rutas. next-intl está diseñado para i18n con rutas. Es overkill para 2 idiomas con diccionarios planos. Zustand con persist es suficiente y simple.
- **Alternativa descartada:** next-intl — optimizado para rutas i18n, no queremos eso. react-intl — bundle grande para 2 idiomas.
- **Trade-off aceptado:** No hay traducción automática de datos dinámicos (ej. títulos de proyectos guardados en DB). Los proyectos se crean en el idioma que el admin elija.
- **Spec relacionada:** SF-30

### D-06: Animaciones con CSS transitions + Intersection Observer nativo

- **Elegido:** Sin librerías de animación. Clases CSS con `transition`, `transform`, `opacity`. Un hook `useIntersectionObserver` basado en `IntersectionObserver` que añade clases `animate-in` cuando un elemento entra al viewport.
- **Razón:** El usuario descartó Framer Motion. CSS transitions son nativas, sin bundle extra, y suficientes para animaciones sutiles (SF-28: fade in al hacer scroll, efectos hover, transiciones suaves).
- **Alternativa descartada:** Framer Motion — bundle pesado (~30KB gzipped). GSAP — overkill para animaciones sutiles.
- **Trade-off aceptado:** Animaciones menos complejas que con una librería. No hay gestos drag, layout animations ni spring physics avanzadas.
- **Spec relacionada:** SF-28

### D-07: packages/db para Prisma (escalabilidad futura)

- **Elegido:** El schema de Prisma y el cliente singleton viven en `packages/db`. `apps/web` importa `@mitzustudios/db`. El esquema y las migraciones se gestionan desde `packages/db`.
- **Razón:** El usuario lo confirmó explícitamente. Aunque solo hay una app ahora, separar el cliente Prisma permite que cualquier paquete futuro (`apps/api`, `apps/worker`, etc.) use la misma base de datos sin duplicar el schema.
- **Alternativa descartada:** Prisma en `apps/web/prisma/` — más simple ahora, pero requeriría refactor si añadimos otra app.
- **Trade-off aceptado:** La configuración inicial es un poco más compleja (workspace dependency, build order en turbo.json).
- **Spec relacionada:** (ninguna directamente, es arquitectónica)

### D-08: Tema oscuro/claro con Tailwind class strategy + localStorage via Zustand

- **Elegido:** Tailwind v4 con `@custom-variant dark (&:where(.dark, .dark *))` (o equivalente v4). Zustand store `theme` persistida en localStorage. Un efecto en el layout raíz aplica/remueve la clase `dark` del `<html>`. Por defecto: oscuro (SF-27, RN-06).
- **Razón:** Tailwind class strategy es el estándar para dark mode con toggle manual. Zustand con persist es más simple que un contexto React para este caso. El store de tema es accesible desde cualquier componente.
- **Alternativa descartada:** `next-themes` — abstrae la lógica pero añade dependencia. Context API + localStorage manual — más código que Zustand con persist.
- **Trade-off aceptado:** El `<html>` muta al cambiar tema (no es RSC-puro en el toggle). Aceptable porque el toggle es interactivo por definición.
- **Spec relacionada:** SF-27, CB-08

### D-09: API Routes vs Server Actions

- **Elegido:** API Routes (`app/api/*`) para todas las mutaciones. Server Actions NO se usan para lógica de negocio. Las API routes se llaman desde componentes cliente con `fetch`.
- **Razón:** Consistencia — todas las operaciones siguen el mismo patrón. Testeables con Vitest + `nextTest`. Las API routes pueden tener rate limiting y validación independiente del componente. Las Server Actions mezclan lógica de servidor con la capa de presentación (menos separación de concerns).
- **Alternativa descartada:** Server Actions — más convenientes para forms progresivos, pero mezclan responsabilidades y no tienen una URL clara para testing.
- **Trade-off aceptado:** Los forms cliente necesitan manejar loading/error states manualmente (react-hook-form + fetch). No hay progressive enhancement nativo.
- **Spec relacionada:** SF-08, SF-10

### D-10: Google Analytics solo en producción con next/script

- **Elegido:** El script de GA4 se carga condicionalmente con `next/script` y `Strategy.AfterInteractive`. Se verifica `process.env.NODE_ENV === 'production'`. El ID de medición se lee de `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opcional, para poder desactivarlo).
- **Razón:** SF-31 especifica que GA solo carga en producción. next/script es la forma óptima de cargar scripts de terceros en Next.js (diferido, non-blocking). El evento de formulario submit se envía manualmente con `gtag('event', ...)`.
- **Alternativa descartada:** `react-ga4` — dependencia extra que envuelve lo mismo. Google Tag Manager — overkill para solo GA4.
- **Trade-off aceptado:** Sin ad-blocker bypass. Sin tracking de navegación tipo SPA con `history.pushState` (solo page views iniciales de GA4).
- **Spec relacionada:** SF-31

---

## Árbol de directorios completo

> **Nota:** Los archivos marcados con `(shadcn)` son generados por `npx shadcn@latest add`. El resto se crean manualmente.

```
mitzustudiosweb/
├── .composer/
│   ├── specs.md
│   ├── architecture.md              ← ESTE ARCHIVO
│   ├── state.json
│   ├── MEMORY.md
│   └── features/
│       ├── landing.feature
│       ├── contact.feature
│       ├── projects.feature
│       ├── admin-auth.feature
│       ├── admin-requests.feature
│       ├── admin-projects.feature
│       ├── theme.feature
│       └── i18n.feature
│
├── .env.example                     # NUEVO — template de variables de entorno
├── .gitignore                       # NUEVO
├── .prettierrc                      # NUEVO
├── pnpm-workspace.yaml              # NUEVO
├── turbo.json                       # NUEVO
├── package.json                     # NUEVO — raíz (workspaces + turbo scripts)
│
├── packages/
│   ├── db/                          # NUEVO — Prisma client compartido
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── index.ts             # re-exporta client, tipos, enums
│   │   │   └── client.ts            # singleton PrismaClient
│   │   └── vitest.config.ts
│   │
│   └── shared/                      # NUEVO — tipos, schemas Zod, i18n
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts
│       │   ├── types/
│       │   │   ├── index.ts
│       │   │   ├── project.ts
│       │   │   ├── service-request.ts
│       │   │   └── api.ts
│       │   ├── schemas/
│       │   │   ├── index.ts
│       │   │   ├── contact.ts        # Zod schema formulario contacto
│       │   │   ├── project.ts        # Zod schema CRUD proyectos
│       │   │   └── auth.ts           # Zod schema login
│       │   └── i18n/
│       │       ├── index.ts          # exporta { es, en }, tipo Dictionary
│       │       ├── es.ts             # diccionario español
│       │       └── en.ts             # diccionario inglés
│       └── vitest.config.ts
│
└── apps/
    └── web/                          # NUEVO — Next.js 16 app
        ├── package.json
        ├── tsconfig.json
        ├── next.config.ts
        ├── postcss.config.mjs
        ├── components.json           # shadcn/ui config
        ├── middleware.ts             # Auth.js middleware (protege /admin/*)
        ├── vitest.config.ts
        │
        ├── prisma/                   # SOLO symlink a packages/db/prisma/schema.prisma
        │   └── schema.prisma         # (opcional, para que el IDE lo encuentre)
        │
        └── src/
            ├── app/
            │   ├── layout.tsx        # Raíz: providers (Theme, Language), Analytics, globals.css
            │   ├── page.tsx          # Landing page (RSC) — compose sections
            │   ├── globals.css       # Tailwind v4 directives + variables CSS tema
            │   ├── not-found.tsx     # Página 404 amigable
            │   ├── error.tsx         # Error boundary (CB-09)
            │   │
            │   ├── admin/
            │   │   ├── layout.tsx    # Admin layout: sidebar + header + auth check
            │   │   ├── page.tsx      # Redirect a /admin/dashboard
            │   │   ├── login/
            │   │   │   └── page.tsx  # Login form (SF-13)
            │   │   ├── dashboard/
            │   │   │   └── page.tsx  # Dashboard con resumen
            │   │   ├── requests/
            │   │   │   ├── page.tsx  # Lista de solicitudes (SF-18, SF-21)
            │   │   │   └── [id]/
            │   │   │       └── page.tsx  # Detalle + responder (SF-19, SF-20)
            │   │   └── projects/
            │   │       ├── page.tsx  # Lista de proyectos (SF-26, SF-40)
            │   │       ├── new/
            │   │       │   └── page.tsx  # Crear proyecto (SF-22, SF-25)
            │   │       └── [id]/
            │   │           └── page.tsx  # Editar proyecto (SF-23)
            │   │
            │   └── api/
            │       ├── auth/
            │       │   └── [...nextauth]/
            │       │       └── route.ts  # Auth.js handler
            │       ├── contact/
            │       │   └── route.ts      # POST — crear solicitud (SF-08)
            │       ├── upload/
            │       │   └── route.ts      # POST — subir imagen a Cloudinary (SF-25)
            │       └── admin/
            │           ├── projects/
            │           │   ├── route.ts          # GET (list), POST (create)
            │           │   └── [id]/
            │           │       └── route.ts      # GET, PATCH, DELETE
            │           └── requests/
            │               ├── route.ts          # GET (list), PATCH (bulk)
            │               └── [id]/
            │                   └── route.ts      # GET (detail), PATCH (status), POST (respond)
            │
            ├── components/
            │   ├── ui/                          # shadcn/ui components (AUTOGENERATED)
            │   │   ├── button.tsx                # (shadcn add button)
            │   │   ├── card.tsx                  # (shadcn add card)
            │   │   ├── input.tsx                 # (shadcn add input)
            │   │   ├── label.tsx                 # (shadcn add label)
            │   │   ├── select.tsx                # (shadcn add select)
            │   │   ├── textarea.tsx              # (shadcn add textarea)
            │   │   ├── badge.tsx                 # (shadcn add badge)
            │   │   ├── table.tsx                 # (shadcn add table)
            │   │   ├── dialog.tsx                # (shadcn add dialog)
            │   │   ├── dropdown-menu.tsx         # (shadcn add dropdown-menu)
            │   │   ├── form.tsx                  # (shadcn add form)
            │   │   ├── sheet.tsx                 # (shadcn add sheet — sidebar móvil)
            │   │   ├── skeleton.tsx              # (shadcn add skeleton)
            │   │   ├── toast.tsx                 # (shadcn add toast)
            │   │   ├── separator.tsx             # (shadcn add separator)
            │   │   └── avatar.tsx                # (shadcn add avatar)
            │   │
            │   ├── landing/
            │   │   ├── HeroSection.tsx           # Hero con CTA (SF-01)
            │   │   ├── AboutSection.tsx          # Sobre mí (SF-02)
            │   │   ├── ServicesSection.tsx       # Servicios (SF-03)
            │   │   ├── ProjectsSection.tsx       # Galería proyectos públicos (SF-04, SF-35)
            │   │   └── ContactSection.tsx        # Formulario contacto (SF-05)
            │   │
            │   ├── projects/
            │   │   ├── ProjectCard.tsx           # Tarjeta de proyecto (SF-11)
            │   │   └── TechnologyBadge.tsx       # Badge tecnología con icono
            │   │
            │   ├── admin/
            │   │   ├── AdminSidebar.tsx          # Sidebar navegación admin
            │   │   ├── AdminHeader.tsx           # Header admin con user info + logout (SF-15)
            │   │   ├── RequestsList.tsx          # Tabla de solicitudes (SF-18, SF-21)
            │   │   ├── RequestDetailCard.tsx     # Detalle de solicitud
            │   │   ├── ResponseForm.tsx          # Formulario responder (SF-20, SF-36, SF-37)
            │   │   ├── ProjectsTable.tsx         # Tabla de proyectos (SF-26, SF-40)
            │   │   ├── ProjectForm.tsx           # Formulario crear/editar proyecto (SF-22, SF-23, SF-25)
            │   │   ├── ImageUploadField.tsx      # Campo de subida de imagen (SF-25)
            │   │   ├── StatusBadge.tsx           # Badge de estado (proyecto/solicitud)
            │   │   └── FilterBar.tsx             # Barra de filtros (SF-21, SF-40)
            │   │
            │   └── shared/
            │       ├── Navbar.tsx                # Navegación principal (SF-27, SF-30)
            │       ├── Footer.tsx                # Footer
            │       ├── ThemeToggle.tsx           # Toggle claro/oscuro (SF-27)
            │       ├── LanguageToggle.tsx        # Toggle ES/EN (SF-30)
            │       ├── SectionAnimation.tsx      # Wrapper IntersectionObserver (SF-28)
            │       └── GoogleAnalytics.tsx       # GA4 script solo prod (SF-31)
            │
            ├── lib/
            │   ├── auth.ts                      # Auth.js configuración completa
            │   ├── auth.config.ts               # Auth.js config edge-compatible
            │   ├── rate-limit.ts                 # LRU Cache rate limiter
            │   ├── whatsapp.ts                   # Generador de wa.me links
            │   ├── cloudinary.ts                 # Upload helper para Cloudinary
            │   ├── resend.ts                     # Cliente Resend singleton
            │   ├── env.ts                        # Zod schema de variables de entorno
            │   └── utils.ts                      # cn() y utilidades
            │
            ├── stores/
            │   ├── theme.ts                      # Zustand store para tema (persist)
            │   └── language.ts                   # Zustand store para idioma (persist)
            │
            └── hooks/
                ├── useTranslations.ts            # Hook que retorna diccionario activo
                ├── useTheme.ts                   # Hook para tema (wrapper de store)
                └── useIntersectionObserver.ts    # Hook para animaciones scroll
```

---

## Modelo de datos (Prisma)

> **Archivo:** `packages/db/prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Enums ───────────────────────────────────────

enum ProjectStatus {
  PUBLISHED
  HIDDEN
  DRAFT
}

enum RequestStatus {
  UNREAD
  READ
  ANSWERED
}

enum ResponseChannel {
  WHATSAPP
  EMAIL
}

// ─── Models ──────────────────────────────────────

model User {
  id            String         @id @default(cuid())
  name          String?
  email         String         @unique
  emailVerified DateTime?
  image         String?
  password      String         // hashed with bcrypt
  role          String?        // "admin" (reservado para futuros roles)
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([email])
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
  @@index([userId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@id([identifier, token])
}

model Project {
  id          String         @id @default(cuid())
  title       String
  description String
  imageUrl    String?
  status      ProjectStatus  @default(DRAFT)
  technologies Technology[]
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([status])
  @@index([createdAt])
}

model Technology {
  id        String  @id @default(cuid())
  name      String
  icon      String
  url       String?
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
}

model ServiceRequest {
  id          String        @id @default(cuid())
  clientName  String
  clientEmail String
  clientPhone String
  projectType String        // valor del select: "landing" | "ecommerce" | "webapp" | "api" | "redesign" | "other"
  otherType   String?       // solo si projectType === "other"
  description String
  status      RequestStatus @default(UNREAD)
  responses   Response[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([status])
  @@index([createdAt])
}

model Response {
  id               String         @id @default(cuid())
  content          String
  channel          ResponseChannel
  serviceRequestId String
  serviceRequest   ServiceRequest @relation(fields: [serviceRequestId], references: [id], onDelete: Cascade)
  createdAt        DateTime       @default(now())

  @@index([serviceRequestId])
}
```

**Migración inicial:**

```bash
cd packages/db
npx prisma migrate dev --name init
npx prisma generate      # genera cliente en packages/db
```

**Seed (opcional):**

```bash
# packages/db/prisma/seed.ts — proyectos demo para desarrollo
npx prisma db seed       # si se configura en package.json
```

> **Nota:** Auth.js con PrismaAdapter y modelo `User`. Los administradores se crean via seed (bcrypt) y su acceso se controla combinando la sesión JWT + verificación contra `ADMIN_EMAILS` en el middleware. Auth.js opera en modo JWT stateless (las tablas Account/Session son requeridas por el adapter pero no se usan para sesión).

---

## Contratos públicos

### Tipos compartidos (`packages/shared/src/types/`)

```ts
// packages/shared/src/types/project.ts
export interface ProjectDTO {
  id: string
  title: string
  description: string
  imageUrl: string | null
  status: 'PUBLISHED' | 'HIDDEN' | 'DRAFT'
  technologies: TechnologyDTO[]
  createdAt: string // ISO date
  updatedAt: string
}

export interface TechnologyDTO {
  id: string
  name: string
  icon: string
  url: string | null
}

export interface CreateProjectInput {
  title: string
  description: string
  technologies: { name: string; icon: string; url?: string }[]
  status?: 'PUBLISHED' | 'HIDDEN' | 'DRAFT'
  // image se envía como File en FormData, no aquí
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  imageUrl?: string | null // null = eliminar imagen
}
```

```ts
// packages/shared/src/types/service-request.ts
export interface ServiceRequestDTO {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  projectType: string
  otherType: string | null
  description: string
  status: 'UNREAD' | 'READ' | 'ANSWERED'
  responses: ResponseDTO[]
  createdAt: string
  updatedAt: string
}

export interface ResponseDTO {
  id: string
  content: string
  channel: 'WHATSAPP' | 'EMAIL'
  createdAt: string
}

export interface CreateServiceRequestInput {
  clientName: string
  clientEmail: string
  clientPhone: string
  projectType: string
  otherType?: string
  description: string
}
```

```ts
// packages/shared/src/types/api.ts
export interface ApiResponse<T = void> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    fieldErrors?: Record<string, string[]>
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
```

### Schemas Zod (`packages/shared/src/schemas/`)

```ts
// packages/shared/src/schemas/contact.ts
import { z } from 'zod'

export const PROJECT_TYPES = ['landing', 'ecommerce', 'webapp', 'api', 'redesign', 'other'] as const

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  landing: 'Landing Page',
  ecommerce: 'Tienda / E-commerce',
  webapp: 'Web App / Aplicación Web',
  api: 'API / Backend',
  redesign: 'Rediseño / Mantenimiento',
  other: 'Otro',
}

export const contactSchema = z
  .object({
    clientName: z.string().min(1, 'El nombre es requerido').max(100),
    clientEmail: z.string().email('Email inválido'),
    clientPhone: z.string().min(7, 'Teléfono inválido').max(20),
    projectType: z.enum(PROJECT_TYPES),
    otherType: z.string().optional(),
    description: z.string().min(10, 'Describe tu proyecto (mín. 10 caracteres)').max(2000),
  })
  .refine((data) => data.projectType !== 'other' || (data.otherType && data.otherType.length > 0), {
    message: 'Describe el tipo de proyecto',
    path: ['otherType'],
  })

export type ContactFormValues = z.infer<typeof contactSchema>
```

```ts
// packages/shared/src/schemas/auth.ts
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
```

```ts
// packages/shared/src/schemas/project.ts
export const technologySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1).max(50), // nombre del icono (lucide, simple-icons, etc.)
  url: z.string().url().optional().or(z.literal('')),
})

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Título requerido').max(200),
  description: z.string().min(1, 'Descripción requerida').max(5000),
  technologies: z.array(technologySchema).min(1, 'Al menos 1 tecnología'),
  status: z.enum(['PUBLISHED', 'HIDDEN', 'DRAFT']).default('DRAFT'),
  // imageUrl se obtiene tras subir a Cloudinary
})

export const updateProjectSchema = createProjectSchema.partial().extend({
  imageUrl: z.string().url().nullable().optional(),
})

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>
export type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>
```

### Diccionarios i18n (`packages/shared/src/i18n/`)

```ts
// packages/shared/src/i18n/index.ts
export type Dictionary = typeof es // es como referencia, define la estructura

export { es } from './es'
export { en } from './en'
```

Estructura del diccionario (definida por `es.ts`):

```
nav: { hero, about, services, projects, contact }
hero: { title, subtitle, cta }
about: { title, content }
services: { title, items: [{ title, description }] }
projects: { title, viewMore, noProjects }
contact: { title, subtitle, form: { name, email, phone, projectType, otherType, description, submit, submitting, success, error, quoteMessage }, errors: { ... } }
admin: { sidebar: { dashboard, requests, projects }, login: { title, email, password, submit, error }, requests: { ... }, projects: { ... }, common: { ... } }
theme: { light, dark }
language: { es, en }
footer: { copyright, ... }
```

---

## API Routes

| Método | Path                               | Auth                      | Input                                                 | Output                                 | Spec                                       |
| ------ | ---------------------------------- | ------------------------- | ----------------------------------------------------- | -------------------------------------- | ------------------------------------------ |
| POST   | `/api/auth/[...nextauth]`          | No                        | credentials                                           | sesión JWT (Auth.js)                   | SF-13                                      |
| POST   | `/api/auth/register`               | No (TEMPORAL)             | `{ name, email, password }`                           | `ApiResponse<null>`                    | SF-13 (setup)                              |
| GET    | `/api/auth/session`                | No                        | —                                                     | session object                         | SF-16                                      |
| POST   | `/api/contact`                     | No                        | `multipart/form-data` o JSON con `ContactFormValues`  | `ApiResponse<{ id: string }>`          | SF-08, SF-10                               |
| GET    | `/api/admin/projects`              | Sí (admin)                | `?status=PUBLISHED&page=1`                            | `PaginatedResponse<ProjectDTO>`        | SF-26, SF-40                               |
| POST   | `/api/admin/projects`              | Sí (admin)                | `multipart/form-data` (fields + image opcional)       | `ApiResponse<ProjectDTO>`              | SF-22, SF-25                               |
| GET    | `/api/admin/projects/[id]`         | Sí (admin)                | —                                                     | `ApiResponse<ProjectDTO>`              | SF-23                                      |
| PATCH  | `/api/admin/projects/[id]`         | Sí (admin)                | `multipart/form-data` (fields + image opcional)       | `ApiResponse<ProjectDTO>`              | SF-23, SF-25                               |
| DELETE | `/api/admin/projects/[id]`         | Sí (admin)                | —                                                     | `ApiResponse<null>`                    | SF-24                                      |
| POST   | `/api/upload`                      | Sí (admin)                | `multipart/form-data` (file)                          | `ApiResponse<{ url: string }>`         | SF-25 (fallback si se usa upload separado) |
| GET    | `/api/admin/requests`              | Sí (admin)                | `?status=UNREAD&page=1`                               | `PaginatedResponse<ServiceRequestDTO>` | SF-18, SF-21                               |
| GET    | `/api/admin/requests/[id]`         | Sí (admin)                | —                                                     | `ApiResponse<ServiceRequestDTO>`       | SF-19                                      |
| PATCH  | `/api/admin/requests/[id]`         | Sí (admin + ADMIN_EMAILS) | `{ status: 'READ' \| 'ANSWERED' }`                    | `ApiResponse<ServiceRequestDTO>`       | SF-19                                      |
| POST   | `/api/admin/requests/[id]/respond` | Sí (admin)                | `{ content: string, channel: 'WHATSAPP' \| 'EMAIL' }` | `ApiResponse<ResponseDTO>`             | SF-36, SF-37                               |

### Registro temporal (se eliminará tras setup)

`POST /api/auth/register` es **temporal**. Solo existe para que Mitzu cree sus 3 cuentas admin desde la UI. Después de crear las 3 cuentas, se elimina:

- `apps/web/src/app/api/auth/register/route.ts`
- `apps/web/src/app/register/page.tsx` (o el componente de registro)
- Cualquier referencia en el navbar/routing

### Autenticación administrador para API routes

Todas las rutas `/api/admin/*` verifican el token JWT de Auth.js. La verificación se hace con:

```ts
// helper en lib/auth.ts
import { auth } from '@/lib/auth'

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }
  // Verificar que el email está en ADMIN_EMAILS (autorización, no autenticación)
  const adminEmails = env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase())
  if (!adminEmails.includes(session.user.email.toLowerCase())) {
    throw new Error('Forbidden')
  }
  return session
}
```

Cada API route admin envuelve su handler con try/catch y responde `401` si `requireAdmin()` lanza error.

### Respuesta de error unificada

Todas las API routes responden con el formato `ApiResponse`:

```ts
// 200 éxito
{ success: true, data: { ... } }

// 400 validación
{ success: false, error: { code: 'VALIDATION_ERROR', message: '...', fieldErrors: { name: ['Campo requerido'] } } }

// 401 no auth
{ success: false, error: { code: 'UNAUTHORIZED', message: 'No autenticado' } }

// 429 rate limit
{ success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Demasiadas solicitudes' } }

// 500 error interno
{ success: false, error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } }
```

---

## Flujo de datos por spec

### SF-01 a SF-05: Landing Page (pública)

```
Cliente navega a /
  → layout.tsx (raíz): aplica ThemeProvider, LanguageProvider, carga GoogleAnalytics
  → page.tsx (RSC): renderiza secciones secuencialmente
    → HeroSection: texto estático + CTA link a #contacto
    → AboutSection: texto estático
    → ServicesSection: texto estático
    → ProjectsSection (RSC):
        → fetch('GET /api/admin/projects?status=PUBLISHED') desde servidor
          → route handler → Prisma: findMany where status=PUBLISHED orderBy createdAt desc
        → mapea a ProjectCard[]
    → ContactSection: contiene ContactForm (cliente)
```

### SF-06 a SF-10, SF-32 a SF-34: Formulario de Contacto

```
Usuario llena formulario en ContactSection
  → ContactForm (react-hook-form + zod: contactSchema)
  → validación cliente: muestra errores por campo (CB-01, CB-02)
  → submit → fetch('POST /api/contact', { body: FormData o JSON })
    → Rate limiter check (por IP) — si excede → 429 + Retry-After (CB-06)
    → Valida body con contactSchema (Zod) — si inválido → 400 + fieldErrors
    → Prisma: ServiceRequest.create({ data: { clientName, clientEmail, clientPhone, projectType, otherType, description } })
    → (en paralelo, con Promise.allSettled, no bloqueante):
        1. Email: Resend.emails.send({ from, to: NOTIFICATION_EMAIL, subject: 'Nueva solicitud...', react: <EmailTemplate /> })
           → si falla → log error (CB-04), no bloquea respuesta
        2. WhatsApp: NO se envía automáticamente. Se registra en DB y el admin ve botón en panel.
    → Responde 201 { success: true, data: { id } }
  → ContactForm muestra mensaje de éxito: "Recibirás una cotización por WhatsApp o email en los próximos días" (SF-34)
  → GA4 event: gtag('event', 'contact_form_submit', { project_type: '...' })
```

### SF-13 a SF-17: Autenticación Admin

```
Setup inicial (SOLO PARA CREAR LOS 3 ADMINS — temporal):
  → Mitzu visita /register (página temporal, se eliminará después)
  → RegisterForm: nombre, email, password, confirmar password
  → submit → POST /api/auth/register
    → Valida con registerSchema (Zod): email válido, password >= 8 chars, passwords coinciden
    → bcrypt.hash(password, 12)
    → Prisma: User.create({ data: { name, email, password: hash } })
    → Responde 201 { success: true }
    → Mitzu repite para los 3 emails en ADMIN_EMAILS
  → DESPUÉS: Mitzu elimina /register page + POST /api/auth/register del código
  → A partir de aquí, solo login en /admin/login

Admin visita /admin/login
  → Auth.js middleware verifica: si hay sesión → redirect a /admin/dashboard
  → LoginForm (react-hook-form + loginSchema)
  → submit → signIn('credentials', { email, password, redirect: false })
    → Auth.js Credentials provider (con PrismaAdapter):
        1. loginSchema.safeParse(credentials)
        2. Busca usuario por email en DB (prisma.user.findUnique)
        3. Compara password con bcrypt.compare
        4. Si ok → return { id: user.id, email: user.email, name: user.name }
        5. Si no → return null (error credenciales)
    → Rate limiter check (por IP) en el provider (SF-17)
  → Si success → redirect a /admin/dashboard
  → Si error → muestra "Credenciales inválidas" (genérico, no revela qué falló)

Admin navega a /admin/* (cualquier ruta protegida)
  → middleware.ts: withAuth + verificación custom:
      1. withAuth redirige a /admin/login si no hay sesión
      2. Si hay sesión, verifica que session.user.email esté en ADMIN_EMAILS
      3. Si no está autorizado → redirect a / (página principal) con mensaje "No autorizado"
  → Renderiza admin layout + componente

Admin cierra sesión (SF-15)
  → signOut() → redirect a /admin/login
```

### SF-18 a SF-21, SF-36, SF-37: Gestión de Solicitudes

```
Admin en /admin/requests
  → RequestsList (cliente)
    → fetch('GET /api/admin/requests?page=1')
    → Muestra tabla: nombre, email, teléfono, tipo, fecha, estado (UNREAD/READ/ANSWERED)
    → FilterBar: filtrar por estado (SF-21)
    → Clic en fila → navigate a /admin/requests/[id]

Admin en /admin/requests/[id] (SF-19, SF-20)
  → RequestDetailCard: muestra todos los datos de la solicitud
  → Checkbox "Marcar como leída" → PATCH /api/admin/requests/[id] { status: 'READ' }
  → Sección Respuestas: lista de respuestas previas
  → ResponseForm (SF-36, SF-37):
    → Textarea para la respuesta
    → Selector de canal: WhatsApp o Email
    → Si WhatsApp:
        1. POST /api/admin/requests/[id]/respond { content, channel: 'WHATSAPP' }
        2. API registra respuesta en DB (Response.create)
        3. API devuelve { waLink: 'https://wa.me/PHONE?text=...' }
        4. Frontend abre window.open(waLink, '_blank') (SF-36)
    → Si Email:
        1. POST /api/admin/requests/[id]/respond { content, channel: 'EMAIL' }
        2. API registra respuesta en DB (Response.create)
        3. API envía email via Resend al cliente
        4. Frontend muestra toast "Respuesta enviada por email" (SF-37)
```

### SF-22 a SF-26, SF-38 a SF-40: CRUD Proyectos

```
Admin en /admin/projects (SF-26)
  → ProjectsTable (cliente)
    → fetch('GET /api/admin/projects?page=1')
    → Tabla: título, estado, tecnologías, fecha, acciones
    → FilterBar: filtrar por estado (PUBLISHED/HIDDEN/DRAFT) (SF-40)
    → Clic editar → navigate a /admin/projects/[id]
    → Clic nuevo → navigate a /admin/projects/new

Admin en /admin/projects/new (SF-22, SF-25)
  → ProjectForm (react-hook-form + createProjectSchema):
    → Campos: título, descripción, tecnologías (array dinámico), estado (default DRAFT)
    → ImageUploadField: input file para imagen (opcional)
  → Submit:
    → FormData se envía a POST /api/admin/projects
    → En el servidor:
        1. Parsear FormData (título, descripción, techs como JSON string, status, file)
        2. Validar con createProjectSchema
        3. Si hay file → cloudinary.uploader.upload(file) → imageUrl
        4. Prisma: Project.create con technologies (create nested)
    → Redirect a /admin/projects con toast éxito
    → Si error Cloudinary → mensaje claro (CB-03)

Admin en /admin/projects/[id] (SF-23, SF-25)
  → ProjectForm (precargado con datos actuales)
  → ImageUploadField: muestra imagen actual si existe, permite reemplazar o eliminar
  → Submit → PATCH /api/admin/projects/[id] (similar a create pero update)
  → Si imageUrl se envía como null → elimina imagen (no sube nada)

Admin elimina proyecto (SF-24)
  → Diálogo de confirmación
  → DELETE /api/admin/projects/[id]
  → Si publicaba imagen en Cloudinary → eliminar de Cloudinary también (opcional, best-effort)
  → Redirect a /admin/projects
```

### SF-27: Tema oscuro/claro

```
App inicia:
  → layout.tsx: ejecuta ThemeInitializer
    → Lee localStorage (via Zustand persist hydratation)
    → Aplica clase 'dark' al <html> si el store dice dark
    → Si no hay preferencia → dark (default)

ThemeToggle (en Navbar):
  → Muestra icono sol/luna según estado actual
  → onClick → themeStore.toggle()
    → Zustand actualiza store + persist a localStorage
    → useEffect: document.documentElement.classList.toggle('dark')
  → Tailwind v4 responde a clase .dark (via custom variant)
```

### SF-28: Animaciones

```
SectionAnimation component:
  → Wrapper que acepta children + animation type (fadeIn, slideUp, etc.)
  → useIntersectionObserver(ref, { threshold: 0.1 })
    → Cuando entra al viewport → añade clase 'animate-in'
    → CSS: .animate-in { animation: fadeIn 0.6s ease-out forwards }
  → Hover effects: CSS nativo en los componentes (transform, shadow)
```

### SF-30: Toggle de idioma

```
App inicia:
  → languageStore hidrata desde localStorage (o default 'es')
  → Componentes usan useTranslations()
    → const t = useTranslations()
    → <h1>{t.hero.title}</h1>

LanguageToggle (en Navbar):
  → Muestra "ES" / "EN" según estado actual
  → onClick → languageStore.toggle()
    → Zustand actualiza store + persist
    → Todos los componentes que usan useTranslations() se re-renderizan
    → No cambian rutas, no recarga página
```

### SF-31: Google Analytics

```
layout.tsx:
  → if (process.env.NODE_ENV === 'production' && env.NEXT_PUBLIC_GA_MEASUREMENT_ID)
    → <GoogleAnalytics /> con next/script
  → GA4 mide page views automáticamente

ContactForm submit exitoso:
  → if (typeof window !== 'undefined' && window.gtag)
    → gtag('event', 'contact_form_submit', { project_type: valor })
```

---

## Mapeo specs → archivos

| Spec  | Archivo(s)                                                                                                            | Función(es) / Componente(s)                                      |
| ----- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| SF-01 | `apps/web/src/app/page.tsx`, `components/landing/HeroSection.tsx`                                                     | HeroSection render                                               |
| SF-02 | `components/landing/AboutSection.tsx`                                                                                 | AboutSection render                                              |
| SF-03 | `components/landing/ServicesSection.tsx`                                                                              | ServicesSection render                                           |
| SF-04 | `components/landing/ProjectsSection.tsx`                                                                              | fetch projects → mapea ProjectCard[]                             |
| SF-05 | `components/landing/ContactSection.tsx`                                                                               | wrapper que contiene ContactForm                                 |
| SF-06 | `components/landing/ContactSection.tsx`, `components/.../ContactForm.tsx` (creado inline o separado)                  | Form fields + projectType select + otherType condicional         |
| SF-07 | `packages/shared/src/schemas/contact.ts`                                                                              | `contactSchema` (Zod)                                            |
| SF-08 | `apps/web/src/app/api/contact/route.ts`, `lib/resend.ts`                                                              | `POST /api/contact` handler, `sendEmail()`                       |
| SF-09 | `components/.../ContactForm.tsx`                                                                                      | toast/alert success/error                                        |
| SF-10 | `lib/rate-limit.ts` + `app/api/contact/route.ts`                                                                      | rate limiter check antes de procesar                             |
| SF-11 | `components/projects/ProjectCard.tsx`, `components/projects/TechnologyBadge.tsx`                                      | Card con título, desc, img, techs                                |
| SF-12 | `app/api/admin/projects/route.ts`                                                                                     | `orderBy: { createdAt: 'desc' }`                                 |
| SF-13 | `app/admin/login/page.tsx`, `app/register/page.tsx` (temporal), `lib/auth.ts`, `lib/auth.config.ts`                   | LoginForm, RegisterForm (temporal), Auth.js credentials provider |
| SF-14 | `lib/auth.ts`, `middleware.ts`                                                                                        | `authorize()` busca user en DB + verifica contra `ADMIN_EMAILS`  |
| SF-15 | `components/admin/AdminHeader.tsx`                                                                                    | signOut() button                                                 |
| SF-16 | `lib/auth.ts` (JWT strategy), `middleware.ts`                                                                         | JWT session, middleware protege rutas                            |
| SF-17 | `lib/rate-limit.ts` + `lib/auth.ts`                                                                                   | rate limiter en endpoint credentials                             |
| SF-18 | `app/admin/requests/page.tsx`, `components/admin/RequestsList.tsx`                                                    | Lista de solicitudes                                             |
| SF-19 | `app/admin/requests/[id]/page.tsx`, `app/api/admin/requests/[id]/route.ts`                                            | Detail + PATCH status                                            |
| SF-20 | `components/admin/ResponseForm.tsx`, `app/api/admin/requests/[id]/respond/route.ts`                                   | ResponseForm + POST respond                                      |
| SF-21 | `components/admin/FilterBar.tsx`, `app/api/admin/requests/route.ts`                                                   | Filter por status query param                                    |
| SF-22 | `app/admin/projects/new/page.tsx`, `components/admin/ProjectForm.tsx`                                                 | Form create + submit                                             |
| SF-23 | `app/admin/projects/[id]/page.tsx`, `app/api/admin/projects/[id]/route.ts`                                            | Form edit + submit                                               |
| SF-24 | `components/admin/ProjectsTable.tsx`, `app/api/admin/projects/[id]/route.ts`                                          | Delete confirm + DELETE                                          |
| SF-25 | `components/admin/ImageUploadField.tsx`, `lib/cloudinary.ts`                                                          | Upload form field + Cloudinary helper                            |
| SF-26 | `app/api/admin/projects/route.ts`                                                                                     | `orderBy: { createdAt: 'desc' }`                                 |
| SF-27 | `components/shared/ThemeToggle.tsx`, `stores/theme.ts`, `app/layout.tsx`                                              | Toggle + Zustand + class on html                                 |
| SF-28 | `components/shared/SectionAnimation.tsx`, `hooks/useIntersectionObserver.ts`                                          | Observer + CSS transitions                                       |
| SF-29 | (global) `app/globals.css`                                                                                            | Media queries, responsive classes                                |
| SF-30 | `components/shared/LanguageToggle.tsx`, `stores/language.ts`, `hooks/useTranslations.ts`, `packages/shared/src/i18n/` | Toggle + Zustand + dictionary                                    |
| SF-31 | `components/shared/GoogleAnalytics.tsx`, `app/layout.tsx`                                                             | GA4 script + event tracking                                      |
| SF-32 | `packages/shared/src/schemas/contact.ts`                                                                              | PROJECT_TYPES enum + conditional otherType                       |
| SF-33 | `lib/whatsapp.ts`, `components/admin/RequestsList.tsx`                                                                | wa.me link generator, button en admin                            |
| SF-34 | `components/.../ContactForm.tsx`                                                                                      | Mensaje post-submit                                              |
| SF-35 | `app/api/admin/projects/route.ts` (GET pública)                                                                       | `where: { status: 'PUBLISHED' }`                                 |
| SF-36 | `components/admin/ResponseForm.tsx`, `lib/whatsapp.ts`                                                                | wa.me link con número del cliente                                |
| SF-37 | `components/admin/ResponseForm.tsx`, `lib/resend.ts`                                                                  | Resend.send() al email del cliente                               |
| SF-38 | `packages/shared/src/schemas/project.ts`, `app/api/admin/projects/route.ts`                                           | `status: ProjectStatus`, default DRAFT                           |
| SF-39 | `components/admin/ProjectForm.tsx`, `app/api/admin/projects/[id]/route.ts`                                            | Status selector + PATCH                                          |
| SF-40 | `components/admin/FilterBar.tsx`, `app/api/admin/projects/route.ts`                                                   | Filter por status query param                                    |

---

## Variables de entorno

**Archivo:** `apps/web/.env.example` (y validación en `lib/env.ts`)

```bash
# ─── Database ───
DATABASE_URL=postgresql://user:pass@host/db

# ─── Auth (Auth.js) ───
AUTH_SECRET=<32+ chars, genera con: openssl rand -base64 32>
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com,admin3@gmail.com
# Las contraseñas de cada admin se hashean con bcrypt en el seed script
# No se almacenan en env vars. Los admins se crean via seed con passwords individuales.

# ─── Resend (Email) ───
RESEND_API_KEY=re_xxxxx
NOTIFICATION_EMAIL=mitzustudioscl@gmail.com

# ─── Cloudinary ───
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456
CLOUDINARY_API_SECRET=abc123

# ─── WhatsApp (wa.me) ───
WHATSAPP_PYME_NUMBER=56912345678       # sin +, código país + número

# ─── Google Analytics ───
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX  # opcional: si no se setea, no carga GA

# ─── Rate Limiting ───
RATE_LIMIT_MAX=10                       # solicitudes por ventana
RATE_LIMIT_WINDOW_MS=60000              # 1 minuto en ms

# ─── Vercel (opcional, lo setea Vercel) ───
NEXT_PUBLIC_VERCEL_URL=mitzustudios.online
```

**Validación con Zod** en `lib/env.ts` usando `@t3-oss/env-nextjs`:

```ts
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    ADMIN_EMAILS: z.string().min(1),
    // ADMIN_PASSWORD ya no es necesaria — las contraseñas se hashean en seed
    RESEND_API_KEY: z.string().min(1),
    NOTIFICATION_EMAIL: z.string().email(),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    WHATSAPP_PYME_NUMBER: z.string().min(8),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  },
  client: {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  },
  runtimeEnv: process.env,
})
```

---

## Dependencias nuevas

> **Nota:** Las versiones exactas deben verificarse al momento de instalar con `npm view <pkg> versions --json`. Las que listo son referenciales (compatibles con Next.js 16 + React 19). El `coder` debe verificar peers.

| Paquete                       | Versión (referencial) | Ámbito                    | Para qué               | Peer deps a verificar |
| ----------------------------- | --------------------- | ------------------------- | ---------------------- | --------------------- |
| `prisma`                      | `^6.x`                | dev (root o packages/db)  | CLI migrations         | —                     |
| `@prisma/client`              | `^6.x`                | packages/db               | ORM runtime            | —                     |
| `next-auth`                   | `^5.x` (beta)         | apps/web                  | Auth.js v5             | next@16               |
| `@auth/core`                  | `^0.x`                | apps/web                  | Auth.js v5 core (peer) | —                     |
| `resend`                      | `^4.x`                | apps/web                  | Email API              | react@19              |
| `cloudinary`                  | `^2.x`                | apps/web                  | Upload imágenes        | —                     |
| `zustand`                     | `^5.x`                | apps/web                  | Estado global          | react@19              |
| `react-hook-form`             | `^7.x`                | apps/web                  | Formularios            | react@19              |
| `@hookform/resolvers`         | `^3.x`                | apps/web                  | Zod resolver           | react-hook-form@7     |
| `zod`                         | `^3.x`                | packages/shared, apps/web | Validación             | —                     |
| `@t3-oss/env-nextjs`          | `^0.x`                | apps/web                  | Env validation         | next@16, zod@3        |
| `lucide-react`                | `^0.x`                | apps/web                  | Iconos                 | react@19              |
| `clsx`                        | `^2.x`                | apps/web                  | cn() utility           | —                     |
| `tailwind-merge`              | `^3.x`                | apps/web                  | cn() utility           | —                     |
| `@types/node`                 | `^22.x`               | dev (root)                | Tipos Node             | —                     |
| `typescript`                  | `^5.x`                | dev (root)                | TS compiler            | —                     |
| `turbo`                       | `^2.x`                | dev (root)                | Turborepo CLI          | —                     |
| `vitest`                      | `^3.x`                | dev (cada paquete)        | Testing                | —                     |
| `prettier`                    | `^3.x`                | dev (root)                | Formatter              | —                     |
| `prettier-plugin-tailwindcss` | `^0.x`                | dev (root)                | Sort classes           | prettier@3            |

### shadcn/ui components (instalar con `npx shadcn@latest add`)

```bash
npx shadcn@latest add button card input label select textarea badge table dialog dropdown-menu form sheet skeleton toast separator avatar
```

Estos componentes se instalan en `apps/web/src/components/ui/`.

---

## Turborepo configuration

**`pnpm-workspace.yaml`:**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**`turbo.json`:**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**`package.json` (raíz):**

```json
{
  "name": "mitzustudios",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "db:generate": "cd packages/db && npx prisma generate",
    "db:migrate:dev": "cd packages/db && npx prisma migrate dev",
    "db:migrate:deploy": "cd packages/db && npx prisma migrate deploy",
    "db:studio": "cd packages/db && npx prisma studio"
  },
  "devDependencies": {
    "turbo": "^2.x",
    "typescript": "^5.x",
    "prettier": "^3.x",
    "prettier-plugin-tailwindcss": "^0.x",
    "@types/node": "^22.x"
  },
  "packageManager": "pnpm@9.x"
}
```

---

## Configuración de Next.js

**`apps/web/next.config.ts`:**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Cloudinary domains for next/image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Turborepo + transpilePackages for workspace packages
  transpilePackages: ['@mitzustudios/db', '@mitzustudios/shared'],
}

export default nextConfig
```

---

## Seguridad

### Capas de protección

| Capa             | Mecanismo                                                                                                                | Spec   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ | ------ |
| Input validation | Zod schemas en todas las API routes                                                                                      | SNF-06 |
| SQL injection    | Prisma parameterized queries (nativo)                                                                                    | SNF-04 |
| Auth API         | Rate limit en `/api/contact` y login                                                                                     | SNF-05 |
| Admin routes     | Auth.js middleware + JWT verification                                                                                    | SNF-08 |
| Credentials      | bcrypt via Auth.js (para hash interno de secret), comparación segura                                                     | SNF-03 |
| Env secrets      | `@t3-oss/env-nextjs` + Zod, nunca `process.env` directo                                                                  | SNF-07 |
| PII              | Datos de contacto solo visibles en panel admin autenticado                                                               | —      |
| CORS             | No expuesto (todo same-origin en Vercel)                                                                                 | —      |
| CSRF             | Auth.js incluye CSRF token en endpoints de auth. Para API routes, el token JWT en cookie httpOnly + SameSite=Lax protege | —      |

### Rate limiter (`lib/rate-limit.ts`)

```ts
interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private max: number
  private windowMs: number

  constructor(max: number = 10, windowMs: number = 60000) {
    this.max = max
    this.windowMs = windowMs
  }

  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now()
    const entry = this.store.get(key)

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs })
      return { allowed: true, remaining: this.max - 1, resetAt: now + this.windowMs }
    }

    if (entry.count >= this.max) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt }
    }

    entry.count++
    return { allowed: true, remaining: this.max - entry.count, resetAt: entry.resetAt }
  }
}

// Singletons por endpoint
export const contactLimiter = new RateLimiter(
  Number(process.env.RATE_LIMIT_MAX) || 10,
  Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
)

export const loginLimiter = new RateLimiter(5, 60000) // 5 intentos/min para login
```

---

## Riesgos y trade-offs

| ID   | Riesgo                                                          | Impacto                                  | Mitigación                                                                      | Aceptado              |
| ---- | --------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- | --------------------- |
| R-01 | Rate limiter en memoria no funciona entre instancias serverless | Falsos positivos/negativos en rate limit | Bajo tráfico esperado. Documentado como trade-off                               | Sí (MVP)              |
| R-02 | Pérdida de localStorage (tema/idioma)                           | Usuario vuelve a defaults                | Defaults sensibles (dark, es). Sin pérdida funcional                            | Sí                    |
| R-03 | Auth.js JWT no revocable (stateless)                            | No se puede forzar logout remoto         | Aceptable para 3 admins. Si se necesita, migrar a adapter DB                    | Sí (MVP)              |
| R-04 | Subida de archivos grande a Cloudinary                          | Timeout o consumo de memoria             | Límite de 10MB en frontend + validación server                                  | Sí                    |
| R-05 | Sin User model en DB                                            | No hay auditoría de quién creó/modificó  | El email del admin está en el JWT, se puede añadir `createdBy` opcional después | Sí (MVP)              |
| R-06 | WhatsApp no automático (wa.me links)                            | Admin debe hacer clic manualmente        | El email de notificación avisa. El panel muestra las no leídas                  | Sí (decisión usuario) |

---

## Checklist de adherencia (para reviewer)

### Estructura y organización

- [ ] Turborepo con 3 paquetes: `apps/web`, `packages/db`, `packages/shared`
- [ ] `packages/db/prisma/schema.prisma` contiene todos los modelos
- [ ] `pnpm-workspace.yaml` lista `apps/*` y `packages/*`
- [ ] `turbo.json` define tareas build, dev, lint, test con dependencias correctas

### Prisma

- [ ] Modelos: Project, Technology, ServiceRequest, Response
- [ ] Enums: ProjectStatus, RequestStatus, ResponseChannel
- [ ] Sin User model (admins van por env vars)
- [ ] Migración inicial versionada (`prisma migrate dev --name init`)
- [ ] Los campos sensibles (PII) solo son accesibles desde queries autenticadas

### API Routes

- [ ] `/api/auth/[...nextauth]` — handler Auth.js
- [ ] `/api/contact` — POST público con rate limiting
- [ ] `/api/admin/*` — todas autenticadas con `requireAdmin()`
- [ ] `/api/admin/projects` — GET (list), POST (create con multipart)
- [ ] `/api/admin/projects/[id]` — GET, PATCH (multipart), DELETE
- [ ] `/api/admin/requests` — GET (list con filtros)
- [ ] `/api/admin/requests/[id]` — GET (detail), PATCH (status)
- [ ] `/api/admin/requests/[id]/respond` — POST (responder)
- [ ] `/api/upload` — POST (fallback si se usa upload separado)
- [ ] Formato de respuesta unificado `ApiResponse<T>` en todas

### Auth

- [ ] Auth.js con Credentials provider
- [ ] JWT strategy (stateless), sin adapter DB
- [ ] `ADMIN_EMAILS` y `ADMIN_PASSWORD` validados en `authorize()`
- [ ] `middleware.ts` protege `/admin/*` con `withAuth()`
- [ ] Login page en `/admin/login`
- [ ] Rate limit login (5 intentos/min)
- [ ] Las API admin verifican sesión con `auth()` de Auth.js

### Componentes landing

- [ ] `HeroSection` — título + CTA
- [ ] `AboutSection` — información mínima
- [ ] `ServicesSection` — lista servicios
- [ ] `ProjectsSection` — fetch proyectos PUBLICADOS + mapea ProjectCard
- [ ] `ContactSection` — contiene ContactForm

### Componentes admin

- [ ] `AdminSidebar` + `AdminHeader` con logout
- [ ] `LoginForm` con react-hook-form + loginSchema
- [ ] `RequestsList` con filtros por estado
- [ ] `RequestDetailCard` + `ResponseForm` (canal WhatsApp/Email)
- [ ] `ProjectsTable` con filtros + `ProjectForm` con `ImageUploadField`

### Componentes shared

- [ ] `Navbar` con ThemeToggle + LanguageToggle
- [ ] `Footer`
- [ ] `SectionAnimation` (IntersectionObserver)
- [ ] `GoogleAnalytics` (solo producción)

### i18n

- [ ] Diccionarios en `packages/shared/src/i18n/{es,en}.ts`
- [ ] `useTranslations()` hook con Zustand store
- [ ] `LanguageToggle` en Navbar
- [ ] Idioma default: español
- [ ] Persistencia en localStorage

### Tema

- [ ] Tailwind v4 dark mode con class strategy
- [ ] `ThemeToggle` + Zustand store
- [ ] Default: dark
- [ ] Persistencia en localStorage
- [ ] Clase `dark` en `<html>` gestionada por el store

### Cloudinary

- [ ] `lib/cloudinary.ts` con upload helper
- [ ] Upload server-side (API route recibe file, sube, devuelve URL)
- [ ] `ImageUploadField` componente de formulario
- [ ] Límite de 10MB en upload
- [ ] Manejo de error con mensaje claro (CB-03)

### WhatsApp

- [ ] `lib/whatsapp.ts` con `generateWameLink(phone, message)`
- [ ] Botón en admin para notificar PYME (nueva solicitud)
- [ ] ResponseForm con opción WhatsApp → wa.me link con datos del cliente
- [ ] Respuesta siempre registrada en DB antes de abrir link

### Rate limiting

- [ ] `lib/rate-limit.ts` con LRU Cache
- [ ] Aplicado en: `POST /api/contact` (10/min) y login (5/min)
- [ ] Responde 429 con `Retry-After` header

### Env

- [ ] `lib/env.ts` con `@t3-oss/env-nextjs`
- [ ] `.env.example` con todas las variables documentadas
- [ ] Sin `process.env` directo en código de aplicación

### Testing

- [ ] Vitest configurado en cada paquete
- [ ] Tests unitarios para: Zod schemas, rate limiter, Cloudinary helper, wa.me generator
- [ ] Tests de API routes con `nextTest` o similar

---

## Dependencias entre paquetes

```mermaid
graph TD
    root[package.json root] --> turbo[turbo]
    root --> web[apps/web]
    root --> db[packages/db]
    root --> shared[packages/shared]

    web --> db
    web --> shared

    db --> prisma[@prisma/client]
    web --> nextauth[next-auth]
    web --> resend[resend]
    web --> cloudinary[cloudinary]
    web --> zustand[zustand]
    web --> rhf[react-hook-form]
    web --> zod[zod]
    web --> t3env[@t3-oss/env-nextjs]

    shared --> zod
```

---

## Orden de implementación sugerido para coder

1. **Fase 0 — Scaffolding:** Root package.json, pnpm-workspace.yaml, turbo.json, tsconfig base, .gitignore, .env.example
2. **Fase 1 — DB:** packages/db (schema, client, migrations)
3. **Fase 2 — Shared:** packages/shared (types, schemas, i18n dictionaries)
4. **Fase 3 — Base Web:** apps/web (next.config, postcss, tailwind, shadcn add, layout raíz, providers)
5. **Fase 4 — Auth:** Auth.js setup, middleware, login page, env validation
6. **Fase 5 — Landing:** Secciones estáticas (Hero, About, Services) + Navbar/Footer + ThemeToggle + LanguageToggle
7. **Fase 6 — Contacto:** ContactForm + POST /api/contact + Resend + wa.me link admin
8. **Fase 7 — Proyectos:** API CRUD + ProjectCard + ProjectsSection (pública) + admin panel projects
9. **Fase 8 — Admin Solicitudes:** Requests list + detail + response form
10. **Fase 9 — Polish:** Animaciones, responsive, Analytics, rate limiting, tests

---

> **Fin de architecture.md** — Listo para que composer lo revise y apruebe.

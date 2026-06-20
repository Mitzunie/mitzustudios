# Secretos del proyecto — MitzuStudios Portfolio

Este documento lista todas las variables de entorno y secretos necesarios para:
- **Ejecución local** (`.env` en `apps/web/`)
- **CI** (GitHub Actions Secrets)
- **Producción** (Vercel Environment Variables)

---

## 1. Variables de entorno — Producción (Vercel)

Configurar en: Vercel Dashboard → Project → Settings → Environment Variables.

| Variable                         | Obligatorio | Cómo generar / Notas                                       |
| -------------------------------- | ----------- | ---------------------------------------------------------- |
| `DATABASE_URL`                   | ✅          | Connection string de Neon o Supabase. Ej: `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET`                    | ✅          | `openssl rand -base64 32` (mín. 32 caracteres)             |
| `ADMIN_EMAILS`                   | ✅          | Emails separados por coma. Ej: `admin1@gmail.com,admin2@gmail.com,admin3@gmail.com` |
| `RESEND_API_KEY`                 | ✅          | Dashboard de Resend → API Keys                             |
| `NOTIFICATION_EMAIL`             | ✅          | Email que recibe notificaciones de contacto. `mitzustudioscl@gmail.com` |
| `CLOUDINARY_CLOUD_NAME`          | ✅          | Cloudinary Dashboard → Account Details                     |
| `CLOUDINARY_API_KEY`             | ✅          | Cloudinary Dashboard → Account Details                     |
| `CLOUDINARY_API_SECRET`          | ✅          | Cloudinary Dashboard → Account Details                     |
| `WHATSAPP_PYME_NUMBER`           | ✅          | Teléfono PYME sin + ni espacios. Ej: `56912345678`         |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | ✅          | Email público mostrado en la sección de contacto           |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`  | ❌ Opcional | Google Analytics 4 Measurement ID. Ej: `G-XXXXXXXX`        |
| `RATE_LIMIT_MAX`                 | ❌ Opcional | `10` (default)                                              |
| `RATE_LIMIT_WINDOW_MS`           | ❌ Opcional | `60000` (default, 1 minuto)                                 |

> ⚠️ `NEXT_PUBLIC_*` se exponen al navegador. No pongas secretos ahí.
> ❌ `NEXT_PUBLIC_GA_MEASUREMENT_ID` es público por diseño (GA4 lo requiere).

---

## 2. Secretos de CI — GitHub Actions

Configurar en: GitHub → Settings → Secrets and variables → Actions → Repository secrets.

| Secreto           | Obligatorio | Propósito                                              |
| ----------------- | ----------- | ------------------------------------------------------ |
| `TURBO_TOKEN`     | ❌ Opcional | Remote cache de Turborepo (Vercel).                    |
| `TURBO_TEAM`      | ❌ Opcional | Team slug de Vercel para remote cache.                 |
| `VERCEL_TOKEN`    | ❌ Opcional | Solo si usas deploy manual (ver `deploy.yml`).         |
| `VERCEL_ORG_ID`   | ❌ Opcional | ID de la organización en Vercel.                       |
| `VERCEL_PROJECT_ID`| ❌ Opcional | ID del proyecto en Vercel.                             |

> **Nota:** CI usa valores dummy para los servicios (postgres local in-job). Solo necesitas los secrets de Turboreco si quieres cache remota.

### Cómo obtener los secrets de Vercel (para deploy manual)

```bash
# VERCEL_TOKEN
# 1. Ve a Vercel Dashboard → Settings → Tokens
# 2. Crea un token con scope completo

# VERCEL_ORG_ID y VERCEL_PROJECT_ID
# 1. Abre el proyecto en Vercel
# 2. Ve a Settings → General
# 3. Copia "Project ID" y "Organization ID"
```

---

## 3. Variables de entorno — Desarrollo local

Crear archivo `apps/web/.env` con:

```env
# Database (Postgres local via docker compose)
DATABASE_URL=postgresql://mitzustudios:mitzustudios_dev@localhost:5432/mitzustudios_portfolio

# Auth
AUTH_SECRET=<generar con openssl rand -base64 32>
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com,admin3@gmail.com

# Resend (email)
RESEND_API_KEY=re_<tu-api-key>
NOTIFICATION_EMAIL=mitzustudioscl@gmail.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=<tu-cloud-name>
CLOUDINARY_API_KEY=<tu-api-key>
CLOUDINARY_API_SECRET=<tu-api-secret>

# WhatsApp
WHATSAPP_PYME_NUMBER=56912345678

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXX

# Contacto público
NEXT_PUBLIC_CONTACT_EMAIL=mitzustudioscl@gmail.com

# Rate limiting (defaults)
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=60000
```

---

## 4. Cómo arrancar el proyecto localmente

```bash
# 1. Levantar servicios (Postgres + Redis)
docker compose up -d

# 2. Copiar env template
cp apps/web/.env.example apps/web/.env
# Editar apps/web/.env con valores reales

# 3. Instalar dependencias
pnpm install

# 4. Generar Prisma client
pnpm db:generate

# 5. Correr migraciones
pnpm db:migrate:dev

# 6. Iniciar dev
pnpm dev
```

---

## 5. Rotación y seguridad

| Secreto          | Frecuencia de rotación | Notas                                |
| ---------------- | ---------------------- | ------------------------------------ |
| `AUTH_SECRET`    | Cada 90 días           | Invalida todas las sesiones activas  |
| `RESEND_API_KEY` | Cada 180 días          | Crear nueva API key, revocar anterior |
| `CLOUDINARY_API_SECRET` | Cada 180 días   | Regenerar desde dashboard Cloudinary  |

> ⚠️ **Nunca** comitear `.env`, `*.local`, o secretos en el repositorio.
> El `.gitignore` ya excluye `.env` y `.env.local`.

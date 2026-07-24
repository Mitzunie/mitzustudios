# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
y este proyecto sigue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2026-07-23

### Added
- Tracking de eventos clave (envío de formulario de contacto, clicks en CTAs del hero, clicks en tarjetas de proyecto, clicks en WhatsApp) enviado al dataLayer de Google Tag Manager.

### Changed
- Reescritura de las secciones "Sobre Mí" y "Servicios" para destacar diferenciadores concretos: desarrollo a medida con Next.js/React, cotización en menos de 48h y precio de partida publicado desde el primer contacto.
- Unificación de la voz de las respuestas del FAQ (JSON-LD) a primera persona singular, consistente con el posicionamiento de fundador/desarrollador único.

## [1.1.0] - 2026-07-23

### Added
- Sistema de cotizaciones (POS) con generación de PDF y envío por email.
- Optimización para buscadores de IA: `robots.txt`, `llms.txt`, sitemap, JSON-LD y `pricing.md`.
- Vercel Speed Insights.
- Sistema de blog con editor markdown para proyectos, incluyendo campo `locale` para contenido bilingüe.
- Página de tarjeta NFC, botones sociales en el footer y Google Tag Manager.
- Captcha Cloudflare Turnstile en el formulario de contacto.
- Nuevas páginas: About, Contact, Services, Zeew Space y KamerrEzz, con enlaces de partners en el footer.
- Señales locales de Chile y JSON-LD de tipo `LocalBusiness` para SEO.

### Changed
- Simplificación de la estructura del repositorio: de monorepo (Turborepo + pnpm workspaces) a un único proyecto Next.js.

### Fixed
- Error de validación del formulario de contacto por el campo `turnstileToken` no registrado en el schema.
- Sitemap y error de hidratación en el sitio.
- Alineación del copyright en el footer.
- Canonical tags e indexación de Google.
- Metadata on-page y enlace huérfano hacia `/nfc`.

## [1.0.0] - 2026-06-20

### Added
- Landing page completa con 5 secciones: Hero, Sobre Mí, Servicios, Proyectos y Contacto. Diseño Neo-Brutalismo con paleta morada oscura y animaciones sutiles al hacer scroll.
- Formulario de contacto con campos validados (Zod): nombre, email, teléfono, tipo de proyecto (select con "Otro" que revela campo de texto) y descripción. Al enviar guarda en base de datos, envía notificación por email (Resend) y WhatsApp a la PYME.
- Galería de proyectos con tarjetas que muestran título, descripción, imagen (Cloudinary) y tecnologías con iconos. Solo los proyectos publicados son visibles.
- Panel administrador completo con autenticación (Auth.js v5 + email/password), login con rate limiting anti-fuerza bruta, y solo 3 usuarios autorizados configurados por variable de entorno.
- CRUD de proyectos desde el panel: crear, editar, eliminar proyectos con estados (publicado/oculto/borrador), subida de imágenes a Cloudinary y filtrado por estado.
- Gestión de solicitudes de contacto desde el panel: listado completo, marcar como leída/no leída, filtrar por estado, responder por WhatsApp o Email con registro en base de datos.
- Registro temporal de administradores en `/register` (pensado para eliminarse tras el setup inicial).
- Sistema de i18n español/inglés con Zustand, toggle de idioma sin cambio de rutas.
- Tema oscuro/claro con toggle manual, modo oscuro por defecto y persistencia en localStorage.
- Google Analytics (GA4) cargado solo en producción.
- Diseño responsive para todos los viewports (320px a 2560px) con navegación operable por teclado y HTML semántico.

### Fixed
- Seguridad: email hardcodeado en el Footer reemplazado por variable de entorno `NEXT_PUBLIC_CONTACT_EMAIL`.
- Middleware admin: ahora verifica `ADMIN_EMAILS` antes de permitir acceso a rutas `/admin/*`.
- Rate limiter de login: extrae la IP real desde los headers `x-forwarded-for` y `x-real-ip` en vez de usar una IP hardcodeada.
- Servicio duplicado eliminado del Footer.

### Security
- Autenticación con Auth.js v5 + PrismaAdapter, contraseñas hasheadas con bcrypt.
- Todas las consultas a la base de datos usan Prisma parameterized queries (protección contra SQL injection).
- Todos los inputs de la API validados con Zod antes de procesar.
- Variables de entorno para datos sensibles (emails, API keys, credenciales), nunca en el código.
- Rate limiting activo en el formulario de contacto y en los endpoints de autenticación.
- Middleware protege las rutas `/admin/*` redirigiendo a login si no hay sesión.

[Unreleased]: https://github.com/Mitzunie/mitzustudios/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/Mitzunie/mitzustudios/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/Mitzunie/mitzustudios/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Mitzunie/mitzustudios/releases/tag/v1.0.0

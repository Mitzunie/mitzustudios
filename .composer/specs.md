# Especificaciones — MitzuStudios Portfolio

> Generado por spec-analyst el 2026-06-19. Iteración #3. Revisión: eliminados todos los items relacionados con SEO.

## Contexto
- **Usuario objetivo:** Visitantes del portfolio (potenciales clientes) + 3 administradores autorizados (MitzuStudios team)
- **Problema que resuelve:** MitzuStudios necesita un portfolio profesional para mostrar proyectos de desarrollo web y recibir solicitudes de contacto de potenciales clientes
- **Motivación / deadline:** Lanzamiento público del portfolio y presencia online de MitzuStudios

## Historia de usuario
> Como visitante, quiero ver el portfolio de MitzuStudios para conocer sus servicios, ver proyectos anteriores y contactar para solicitar desarrollo web.
> Como administrador, quiero gestionar las solicitudes de contacto y el catálogo de proyectos desde un panel privado.

---

## Specs funcionales

### Landing Page (pública)

- [ ] **SF-01:** La landing page muestra una sección **Hero** con título principal y call-to-action visible al cargar.
- [ ] **SF-02:** La landing page muestra una sección **"Sobre Mí"** con información mínima (es desarrollador), sin datos personales extensos.
- [ ] **SF-03:** La landing page muestra una sección **"Servicios"** listando desarrollo web como servicio ofrecido.
- [ ] **SF-04:** La landing page muestra una sección **"Proyectos"** tipo galería con tarjetas de proyecto.
- [ ] **SF-05:** La landing page muestra una sección **"Contacto"** con el formulario de contacto embebido.

### Formulario de Contacto

- [ ] **SF-06:** El formulario de contacto incluye los campos: **Nombre**, **Email**, **Teléfono**, **Tipo de Proyecto** (select con opciones) y **Descripción**.
- [ ] **SF-32:** El campo **Tipo de Proyecto** es un select con las opciones: *Landing Page*, *Tienda / E-commerce*, *Web App / Aplicación Web*, *API / Backend*, *Rediseño / Mantenimiento* y *Otro*. Si se selecciona "Otro", aparece un campo de texto adicional para describir el tipo de proyecto.
- [ ] **SF-07:** El formulario de contacto **valida todos los inputs con Zod** antes de enviarlos al servidor.
- [ ] **SF-08:** Al enviar el formulario exitosamente, la solicitud se **guarda en la base de datos** y se envía una **notificación por email** (vía Resend) a la dirección configurada en variable de entorno.
- [ ] **SF-33:** Al enviar el formulario exitosamente, se envía automáticamente un **WhatsApp al número de la PYME** (configurado en variable de entorno) con los datos de la solicitud: nombre, email, teléfono, tipo de proyecto y descripción.
- [ ] **SF-34:** Tras el envío exitoso del formulario, el cliente ve un **mensaje en pantalla** informando que recibirá una cotización por WhatsApp o email en los próximos días.
- [ ] **SF-09:** El formulario muestra **feedback visual de éxito o error** tras el intento de envío.
- [ ] **SF-10:** El endpoint `/api/contact` tiene **rate limiting** para prevenir abuso desde una misma IP.

### Galería de Proyectos

- [ ] **SF-11:** Cada tarjeta de proyecto muestra: **título**, **descripción corta**, **imagen** (desde Cloudinary, si existe) y **tecnologías** con iconos. Si la tecnología tiene un enlace (GitHub), se muestra como enlace clicable; si no, solo se muestra el icono y nombre.
- [ ] **SF-12:** Los proyectos se ordenan por **fecha de creación descendente** (más reciente primero).
- [ ] **SF-35:** Solo los proyectos con estado **"publicado"** aparecen en la galería pública del portfolio. Los proyectos en estado **"oculto"** o **"borrador"** no se muestran.

### Panel Admin — Autenticación

- [ ] **SF-13:** El panel admin requiere **login con email y contraseña** mediante Auth.js (NextAuth v5).
- [ ] **SF-14:** Solo **3 usuarios autorizados** pueden autenticarse en el panel. La lista de emails autorizados se configura **exclusivamente mediante variable de entorno** (lista de emails separados por coma).
- [ ] **SF-15:** El admin puede **cerrar sesión** desde el panel, finalizando la sesión activa.
- [ ] **SF-16:** La sesión autenticada **persiste entre recargas de página** dentro del tiempo de vida del token.
- [ ] **SF-17:** El endpoint de login tiene **rate limiting** para prevenir ataques de fuerza bruta.

### Panel Admin — Solicitudes de Contacto

- [ ] **SF-18:** El admin puede **ver el listado completo** de solicitudes de contacto recibidas.
- [ ] **SF-19:** El admin puede **marcar una solicitud como leída o no leída**.
- [ ] **SF-20:** El admin puede **responder una solicitud** desde el panel, eligiendo el canal de envío: **WhatsApp o Email** (a elección del admin).
- [ ] **SF-36:** Cuando el admin responde por **WhatsApp**, el sistema envía la respuesta al número del solicitante y la respuesta queda registrada en la DB asociada a la solicitud.
- [ ] **SF-37:** Cuando el admin responde por **Email**, el sistema envía la respuesta al email del solicitante (vía Resend) y la respuesta queda registrada en la DB asociada a la solicitud.
- [ ] **SF-21:** El admin puede **filtrar u ordenar** las solicitudes por estado (leída/no leída).

### Panel Admin — CRUD de Proyectos

- [ ] **SF-22:** El admin puede **crear un proyecto nuevo** con título, descripción, tecnologías y estado. La imagen es **opcional** (se puede añadir después).
- [ ] **SF-23:** El admin puede **editar** todos los campos de un proyecto existente, incluyendo imagen y estado.
- [ ] **SF-24:** El admin puede **eliminar** un proyecto existente de forma permanente.
- [ ] **SF-25:** El admin puede **subir imágenes** desde el panel hacia Cloudinary.
- [ ] **SF-26:** Los proyectos en el panel se muestran ordenados por **fecha de creación** (más reciente primero).
- [ ] **SF-38:** Cada proyecto tiene un **estado** que puede ser: **publicado**, **oculto** o **borrador**.
- [ ] **SF-39:** El admin puede **cambiar el estado** de un proyecto desde el panel (publicar, ocultar o dejar en borrador).
- [ ] **SF-40:** El admin puede **filtrar proyectos por estado** (publicado/oculto/borrador) en el panel.

### UI / UX Global

- [ ] **SF-27:** La interfaz tiene un **toggle manual** para cambiar entre modo **oscuro y claro** (oscuro por defecto).
- [ ] **SF-28:** Los elementos de la página tienen **animaciones sutiles**: fade in al hacer scroll, efectos hover y transiciones suaves.
- [ ] **SF-29:** Todas las páginas y componentes son **responsives** (mobile, tablet, desktop).
- [ ] **SF-30:** La interfaz tiene un **toggle de idioma** para cambiar entre **Español e Inglés**. El toggle solo cambia los textos y etiquetas de la UI; **no modifica las rutas** (todo permanece en el mismo path).
- [ ] **SF-31:** El sitio carga **Google Analytics** y rastrea las visitas a páginas.

---

## Specs no funcionales

- [ ] **SNF-01:** Performance — Las páginas públicas deben cargar con **p95 < 200ms** en el primer Contentful Paint (medido en Vercel Edge).
- [ ] **SNF-02:** Performance — **Lighthouse score > 90** en Performance, Accessibility y Best Practices.
- [ ] **SNF-03:** Seguridad — Las contraseñas se almacenan con **bcrypt** (via Auth.js).
- [ ] **SNF-04:** Seguridad — Todas las consultas a DB usan **Prisma parameterized queries** (protección SQL injection).
- [ ] **SNF-05:** Seguridad — **Rate limiting** activo en `/api/contact` y endpoints de autenticación.
- [ ] **SNF-06:** Seguridad — Todos los inputs de API se validan con **Zod** antes de procesar.
- [ ] **SNF-07:** Seguridad — Las credenciales de email y API keys se leen exclusivamente de **variables de entorno** (process.env), nunca del código.
- [ ] **SNF-08:** Seguridad — Las rutas del panel admin (`/admin/*`) redirigen a login si el usuario no está autenticado.
- [ ] **SNF-09:** Accesibilidad — El HTML es semántico, las imágenes tienen **alt text**, y la navegación es operable por teclado.
- [ ] **SNF-10:** Responsive — El layout funciona correctamente en viewports desde **320px hasta 2560px** sin pérdida de funcionalidad.

---

## Reglas de negocio

- **RN-01:** **Máximo 3 usuarios administradores** pueden tener acceso autorizado al panel. La lista de emails autorizados se configura **exclusivamente por variable de entorno** (no en código ni en DB).
- **RN-02:** La imagen del proyecto es **opcional**. Un proyecto puede crearse sin imagen y añadirse después mediante edición.
- **RN-03:** Los proyectos se listan siempre ordenados por **fecha de creación descendente**.
- **RN-04:** El formulario de contacto **NO procesa pagos**. Solo genera solicitudes de contacto.
- **RN-05:** El destinatario de las notificaciones por email y el número de WhatsApp de la PYME se configuran **exclusivamente por variable de entorno** (no aparecen ni en código, ni en frontend, ni en logs).
- **RN-06:** El tema por defecto del sitio es **modo oscuro**.
- **RN-07:** El idioma por defecto del sitio es **Español**.
- **RN-08:** Solo los proyectos con estado **"publicado"** son visibles en la galería pública. Los proyectos en **"oculto"** o **"borrador"** solo se ven en el panel admin.
- **RN-09:** Un proyecto nuevo se crea con estado **"borrador"** por defecto.
- **RN-10:** La respuesta del admin a una solicitud queda **registrada en la base de datos** asociada a la solicitud original, independientemente del canal usado (WhatsApp o Email).

---

## Casos borde / errores

- [ ] **CB-01:** Input inválido en formulario de contacto — el sistema muestra errores de validación específicos por campo (Zod).
- [ ] **CB-02:** Formulario de contacto enviado vacío — se rechaza con errores de validación en todos los campos requeridos.
- [ ] **CB-03:** Fallo al subir imagen a Cloudinary — el panel muestra mensaje de error claro y permite reintentar.
- [ ] **CB-04:** Servicio de email (Resend) caído — el formulario de contacto guarda la solicitud en DB pero la notificación por email falla sin bloquear al usuario. La solicitud y sus datos siguen siendo accesibles desde el panel admin para visualización/descarga.
- [ ] **CB-05:** Usuario no autenticado intenta acceder a `/admin/*` — redirigido a `/admin/login` con código 302.
- [ ] **CB-06:** Rate limit excedido en formulario o login — el endpoint responde con **HTTP 429** e incluye cabecera `Retry-After`.
- [ ] **CB-07:** Concurrencia — dos administradores modifican el mismo proyecto simultáneamente. La última escritura prevalece sin corrupción de datos.
- [ ] **CB-08:** Preferencias de tema e idioma — al recargar la página, la preferencia del usuario persiste (localStorage o cookie).
- [ ] **CB-09:** Fallo de conexión a base de datos — el sitio público muestra una página de error amigable, no una traza interna.
- [ ] **CB-10:** Servicio de WhatsApp caído al enviar notificación — la solicitud se guarda en DB igualmente, el error se registra en logs, y la info sigue disponible en el panel admin.
- [ ] **CB-11:** Proyecto creado sin imagen — el proyecto se crea correctamente, aparece en el panel, y en la galería pública se muestra sin imagen (placeholder o layout alternativo).
- [ ] **CB-12:** Admin elimina un proyecto publicado — el proyecto desaparece de la galería pública inmediatamente.

---

## Roles y permisos

| Rol | Puede ver | Puede modificar | Puede crear | Puede borrar |
|-----|-----------|-----------------|-------------|--------------|
| Visitante anónimo | Landing page, proyectos públicos | — | — | — |
| Administrador | Panel admin, solicitudes, proyectos | Solicitudes (estado), proyectos | Proyectos | Proyectos |

---

## Datos sensibles (PII / regulado)

- **Email del visitante** — recogido en formulario de contacto. No expuesto públicamente. Solo visible en panel admin.
- **Teléfono del visitante** — recogido en formulario de contacto. No expuesto públicamente. Solo visible en panel admin.
- **Email de notificación** (mitzustudioscl@gmail.com) — SOLO en variable de entorno. Nunca en código, frontend, logs o repositorio.
- **Credenciales de administradores** — hasheadas con bcrypt via Auth.js. Nunca en texto plano.

---

## Fuera de alcance (explícito)

- Pagos / pasarela de pago
- Blog o sección de noticias
- Múltiples imágenes por proyecto (solo 1)
- Registro público de usuarios
- Roles más complejos (solo admin único nivel)
- Panel de analytics / estadísticas
- API pública para terceros
- Testimonios de clientes
- Chat en vivo / atención en tiempo real (solo notificaciones unidireccionales)
- Validación de entrega de mensajes WhatsApp (solo envío best-effort)

---

## Criterios de aceptación

- [ ] **CA-01:** La landing page carga y muestra las 5 secciones (Hero, Sobre Mí, Servicios, Proyectos, Contacto) sin errores.
- [ ] **CA-02:** El formulario de contacto rechaza campos inválidos con mensajes específicos y no envía si hay errores.
- [ ] **CA-03:** Una solicitud de contacto exitosa guarda el registro en DB, envía email de notificación al destinatario configurado y envía WhatsApp al número PYME configurado.
- [ ] **CA-04:** El panel admin rechaza acceso no autenticado y redirige a `/admin/login`.
- [ ] **CA-05:** Login con credenciales correctas crea sesión y redirige al dashboard del panel.
- [ ] **CA-06:** Login con credenciales incorrectas muestra error y no crea sesión.
- [ ] **CA-07:** El admin puede ver el listado de solicitudes, marcar como leída, y responder desde el panel.
- [ ] **CA-08:** El admin puede crear, editar y eliminar proyectos desde el panel.
- [ ] **CA-09:** El admin puede subir una imagen a Cloudinary desde el panel y asociarla a un proyecto.
- [ ] **CA-10:** El toggle de tema cambia entre modo oscuro y claro; el modo oscuro es el predeterminado.
- [ ] **CA-11:** El toggle de idioma cambia el contenido entre español e inglés sin recargar la página.
- [ ] **CA-12:** Las tarjetas de proyecto muestran título, descripción, imagen y tecnologías con iconos y enlaces.
- [ ] **CA-13:** El sitio carga en viewports de 320px, 768px y 1440px sin desbordamiento horizontal ni pérdida de contenido.
- [ ] **CA-14:** Lighthouse score > 90 en Performance, Accessibility y Best Practices.
- [ ] **CA-15:** El rate limit en `/api/contact` responde 429 tras exceder el límite configurado.
- [ ] **CA-16:** Al seleccionar "Otro" en Tipo de Proyecto, aparece un campo de texto para describir el tipo.
- [ ] **CA-17:** Tras enviar una solicitud, el cliente ve un mensaje indicando que recibirá una cotización por WhatsApp o email.
- [ ] **CA-18:** El admin puede responder una solicitud seleccionando el canal (WhatsApp o Email) y la respuesta queda registrada en la DB.
- [ ] **CA-19:** Un proyecto se crea con estado "borrador" por defecto y no aparece en la galería pública hasta que se publique.
- [ ] **CA-20:** El admin puede cambiar el estado de un proyecto a publicado, oculto o borrador desde el panel.
- [ ] **CA-21:** Un proyecto sin imagen se muestra correctamente en la galería con un placeholder.

---

## Dependencias externas

| Servicio / Librería | Versión (referencia) | Propósito |
|---------------------|----------------------|-----------|
| Next.js | 16 (App Router) | Framework frontend + API routes |
| shadcn/ui | Última compatible con Tailwind v4 | Componentes UI |
| Tailwind CSS | v4 | Estilos utilitarios |
| Prisma | Última estable | ORM + migraciones |
| PostgreSQL (Neon/Supabase) | Serverless | Base de datos |
| Auth.js (NextAuth) | v5 | Autenticación email+password |
| Resend | Última estable | Envío de emails transaccionales |
| Cloudinary | Última estable | Almacenamiento y entrega de imágenes |
| Zod | Última estable | Validación de esquemas |
| WhatsApp Business API / Twilio | Última estable | Notificaciones WhatsApp a PYME y respuestas a clientes |
| Google Analytics | v4 (GA4) | Analytics de visitas |
| Zustand | Última estable | Estado global del cliente |
| React Hook Form | Última estable | Manejo de formularios |
| Vitest | Última estable | Testing unitario |

---

## Asunciones (necesitan confirmación si cambian)

- Las 5 secciones de la landing page están en una sola página (scroll), no en rutas separadas.
- Los 3 usuarios administradores se configuran **exclusivamente por variable de entorno** (lista de emails autorizados), no hay registro público.
- El tipo de proyecto en el formulario es un **select** con las opciones definidas; "Otro" revela un campo de texto.
- Las tecnologías en cada proyecto se almacenan como array de objetos con nombre, icono y URL opcional (GitHub).
- El admin puede responder solicitudes por **WhatsApp o Email** (elige el canal al responder). La respuesta queda registrada en DB.
- Google Analytics se carga solo en producción (no en desarrollo).
- El toggle de idioma solo cambia textos/labels, no modifica rutas.
- El servicio de WhatsApp (Twilio o similar) requiere configuración de variables de entorno (API key, número destino).
- Los proyectos tienen estado: publicado / oculto / borrador. Solo "publicado" aparece en galería pública.

---

## Trazabilidad specs → escenarios BDD

| Spec | Escenario(s) | Archivo |
|------|--------------|---------|
| SF-01 | "La landing page carga con las 5 secciones" | features/landing.feature |
| SF-02 | "La landing page carga con las 5 secciones" | features/landing.feature |
| SF-03 | "La landing page carga con las 5 secciones" | features/landing.feature |
| SF-04 | "La landing page carga con las 5 secciones" | features/landing.feature |
| SF-05 | "La landing page carga con las 5 secciones" | features/landing.feature |
| SF-06 | "Envío exitoso del formulario de contacto", "Campos inválidos en formulario" | features/contact.feature |
| SF-07 | "Campos inválidos en formulario de contacto" | features/contact.feature |
| SF-08 | "Envío exitoso del formulario de contacto" | features/contact.feature |
| SF-09 | "Envío exitoso del formulario de contacto", "Fallo del servicio de email" | features/contact.feature |
| SF-10 | "Rate limit excedido en formulario de contacto" | features/contact.feature |
| SF-11 | "Visualización de tarjetas de proyecto" | features/projects.feature |
| SF-12 | "Visualización de tarjetas de proyecto" | features/projects.feature |
| SF-13 | "Login con credenciales correctas", "Login con credenciales incorrectas" | features/admin-auth.feature |
| SF-14 | "Login con credenciales correctas" (verifica users permitidos) | features/admin-auth.feature |
| SF-15 | "Logout del panel admin" | features/admin-auth.feature |
| SF-16 | "Sesión persiste al recargar página" | features/admin-auth.feature |
| SF-17 | "Rate limit en login excedido" | features/admin-auth.feature |
| SF-18 | "Visualizar listado de solicitudes" | features/admin-requests.feature |
| SF-19 | "Marcar solicitud como leída/no leída" | features/admin-requests.feature |
| SF-20 | "Responder a una solicitud desde el panel" | features/admin-requests.feature |
| SF-21 | "Filtrar solicitudes por estado" | features/admin-requests.feature |
| SF-22 | "Crear un proyecto nuevo" | features/admin-projects.feature |
| SF-23 | "Editar un proyecto existente" | features/admin-projects.feature |
| SF-24 | "Eliminar un proyecto existente" | features/admin-projects.feature |
| SF-25 | "Subir imagen a Cloudinary desde el panel" | features/admin-projects.feature |
| SF-26 | "Visualizar listado de proyectos ordenados por fecha" | features/admin-projects.feature |
| SF-27 | "Cambiar entre modo oscuro y claro" | features/theme.feature |
| SF-28 | "Animaciones en elementos de la página" | features/landing.feature |
| SF-29 | "Responsive en viewports mobile, tablet y desktop" | features/landing.feature |
| SF-30 | "Cambiar idioma entre español e inglés" | features/i18n.feature |
| SF-31 | "Google Analytics se carga en producción" | features/landing.feature |
| SF-32 | "Cliente selecciona 'Otro' en tipo de proyecto y escribe descripción" | features/contact.feature |
| SF-33 | "Nueva solicitud dispara notificación WhatsApp a PYME" | features/admin-requests.feature |
| SF-34 | "Al enviar solicitud se notifica que será contactado por WhatsApp" | features/contact.feature |
| SF-35 | "Galería solo muestra proyectos publicados" | features/projects.feature |
| SF-36 | "Admin responde solicitud vía WhatsApp" | features/admin-requests.feature |
| SF-37 | "Admin responde solicitud vía Email" | features/admin-requests.feature |
| SF-38 | "Proyecto se crea como borrador", "Proyecto se publica/oculta desde el panel" | features/admin-projects.feature |
| SF-39 | "Proyecto se publica/oculta desde el panel" | features/admin-projects.feature |
| SF-40 | "Filtrar proyectos por estado en el panel" | features/admin-projects.feature |
| SNF-01 a SNF-10 | (Cubiertos indirectamente por tests de performance y seguridad) | — |
| CB-01 | "Campos inválidos en formulario de contacto" | features/contact.feature |
| CB-02 | "Campos inválidos en formulario de contacto" | features/contact.feature |
| CB-03 | "Fallo al subir imagen a Cloudinary" | features/admin-projects.feature |
| CB-04 | "Fallo del servicio de email al enviar notificación" | features/contact.feature |
| CB-05 | "Acceso no autenticado al panel admin" | features/admin-auth.feature |
| CB-06 | "Rate limit excedido en formulario de contacto", "Rate limit en login excedido" | features/contact.feature, features/admin-auth.feature |
| CB-07 | "Concurrencia al editar proyectos" | features/admin-projects.feature |
| CB-08 | "Preferencias de tema persisten al recargar" | features/theme.feature |
| CB-09 | "Fallo de conexión a base de datos" | features/landing.feature |
| CB-10 | "Fallo del servicio de WhatsApp al enviar notificación" | features/contact.feature |
| CB-11 | "Crear proyecto sin imagen" | features/admin-projects.feature |
| CB-12 | "Admin elimina un proyecto" | features/admin-projects.feature |

# Especificaciones â€” MitzuStudios Portfolio

> Generado por spec-analyst el 2026-06-19. IteraciÃ³n #3. RevisiÃ³n: eliminados todos los items relacionados con SEO.

## Contexto

- **Usuario objetivo:** Visitantes del portfolio (potenciales clientes) + 3 administradores autorizados (MitzuStudios team)
- **Problema que resuelve:** MitzuStudios necesita un portfolio profesional para mostrar proyectos de desarrollo web y recibir solicitudes de contacto de potenciales clientes
- **MotivaciÃ³n / deadline:** Lanzamiento pÃºblico del portfolio y presencia online de MitzuStudios

## Historia de usuario

> Como visitante, quiero ver el portfolio de MitzuStudios para conocer sus servicios, ver proyectos anteriores y contactar para solicitar desarrollo web.
> Como administrador, quiero gestionar las solicitudes de contacto y el catÃ¡logo de proyectos desde un panel privado.

---

## Specs funcionales

### Landing Page (pÃºblica)

- [x] **SF-01:** La landing page muestra una secciÃ³n **Hero** con tÃ­tulo principal y call-to-action visible al cargar.
- [x] **SF-02:** La landing page muestra una secciÃ³n **"Sobre MÃ­"** con informaciÃ³n mÃ­nima (es desarrollador), sin datos personales extensos.
- [x] **SF-03:** La landing page muestra una secciÃ³n **"Servicios"** listando desarrollo web como servicio ofrecido.
- [x] **SF-04:** La landing page muestra una secciÃ³n **"Proyectos"** tipo galerÃ­a con tarjetas de proyecto.
- [x] **SF-05:** La landing page muestra una secciÃ³n **"Contacto"** con el formulario de contacto embebido.

### Formulario de Contacto

- [x] **SF-06:** El formulario de contacto incluye los campos: **Nombre**, **Email**, **TelÃ©fono**, **Tipo de Proyecto** (select con opciones) y **DescripciÃ³n**.
- [x] **SF-32:** El campo **Tipo de Proyecto** es un select con las opciones: _Landing Page_, _Tienda / E-commerce_, _Web App / AplicaciÃ³n Web_, _API / Backend_, _RediseÃ±o / Mantenimiento_ y _Otro_. Si se selecciona "Otro", aparece un campo de texto adicional para describir el tipo de proyecto.
- [x] **SF-07:** El formulario de contacto **valida todos los inputs con Zod** antes de enviarlos al servidor.
- [x] **SF-08:** Al enviar el formulario exitosamente, la solicitud se **guarda en la base de datos** y se envÃ­a una **notificaciÃ³n por email** (vÃ­a Resend) a la direcciÃ³n configurada en variable de entorno.
- [x] **SF-33:** Al enviar el formulario exitosamente, se envÃ­a automÃ¡ticamente un **WhatsApp al nÃºmero de la PYME** (configurado en variable de entorno) con los datos de la solicitud: nombre, email, telÃ©fono, tipo de proyecto y descripciÃ³n.
- [x] **SF-34:** Tras el envÃ­o exitoso del formulario, el cliente ve un **mensaje en pantalla** informando que recibirÃ¡ una cotizaciÃ³n por WhatsApp o email en los prÃ³ximos dÃ­as.
- [x] **SF-09:** El formulario muestra **feedback visual de Ã©xito o error** tras el intento de envÃ­o.
- [x] **SF-10:** El endpoint `/api/contact` tiene **rate limiting** para prevenir abuso desde una misma IP.

### GalerÃ­a de Proyectos

- [x] **SF-11:** Cada tarjeta de proyecto muestra: **tÃ­tulo**, **descripciÃ³n corta**, **imagen** (desde Cloudinary, si existe) y **tecnologÃ­as** con iconos. Si la tecnologÃ­a tiene un enlace (GitHub), se muestra como enlace clicable; si no, solo se muestra el icono y nombre.
- [x] **SF-12:** Los proyectos se ordenan por **fecha de creaciÃ³n descendente** (mÃ¡s reciente primero).
- [x] **SF-35:** Solo los proyectos con estado **"publicado"** aparecen en la galerÃ­a pÃºblica del portfolio. Los proyectos en estado **"oculto"** o **"borrador"** no se muestran.

### Panel Admin â€” AutenticaciÃ³n

- [x] **SF-13:** El panel admin requiere **login con email y contraseÃ±a** mediante Auth.js (NextAuth v5).
- [x] **SF-14:** Solo **3 usuarios autorizados** pueden autenticarse en el panel. La lista de emails autorizados se configura **exclusivamente mediante variable de entorno** (lista de emails separados por coma).
- [x] **SF-15:** El admin puede **cerrar sesiÃ³n** desde el panel, finalizando la sesiÃ³n activa.
- [x] **SF-16:** La sesiÃ³n autenticada **persiste entre recargas de pÃ¡gina** dentro del tiempo de vida del token.
- [x] **SF-17:** El endpoint de login tiene **rate limiting** para prevenir ataques de fuerza bruta.

### Panel Admin â€” Solicitudes de Contacto

- [x] **SF-18:** El admin puede **ver el listado completo** de solicitudes de contacto recibidas.
- [x] **SF-19:** El admin puede **marcar una solicitud como leÃ­da o no leÃ­da**.
- [x] **SF-20:** El admin puede **responder una solicitud** desde el panel, eligiendo el canal de envÃ­o: **WhatsApp o Email** (a elecciÃ³n del admin).
- [x] **SF-36:** Cuando el admin responde por **WhatsApp**, el sistema envÃ­a la respuesta al nÃºmero del solicitante y la respuesta queda registrada en la DB asociada a la solicitud.
- [x] **SF-37:** Cuando el admin responde por **Email**, el sistema envÃ­a la respuesta al email del solicitante (vÃ­a Resend) y la respuesta queda registrada en la DB asociada a la solicitud.
- [x] **SF-21:** El admin puede **filtrar u ordenar** las solicitudes por estado (leÃ­da/no leÃ­da).

### Panel Admin â€” CRUD de Proyectos

- [x] **SF-22:** El admin puede **crear un proyecto nuevo** con tÃ­tulo, descripciÃ³n, tecnologÃ­as y estado. La imagen es **opcional** (se puede aÃ±adir despuÃ©s).
- [x] **SF-23:** El admin puede **editar** todos los campos de un proyecto existente, incluyendo imagen y estado.
- [x] **SF-24:** El admin puede **eliminar** un proyecto existente de forma permanente.
- [x] **SF-25:** El admin puede **subir imÃ¡genes** desde el panel hacia Cloudinary.
- [x] **SF-26:** Los proyectos en el panel se muestran ordenados por **fecha de creaciÃ³n** (mÃ¡s reciente primero).
- [x] **SF-38:** Cada proyecto tiene un **estado** que puede ser: **publicado**, **oculto** o **borrador**.
- [x] **SF-39:** El admin puede **cambiar el estado** de un proyecto desde el panel (publicar, ocultar o dejar en borrador).
- [x] **SF-40:** El admin puede **filtrar proyectos por estado** (publicado/oculto/borrador) en el panel.

### UI / UX Global

- [x] **SF-27:** La interfaz tiene un **toggle manual** para cambiar entre modo **oscuro y claro** (oscuro por defecto).
- [x] **SF-28:** Los elementos de la pÃ¡gina tienen **animaciones sutiles**: fade in al hacer scroll, efectos hover y transiciones suaves.
- [x] **SF-29:** Todas las pÃ¡ginas y componentes son **responsives** (mobile, tablet, desktop).
- [x] **SF-30:** La interfaz tiene un **toggle de idioma** para cambiar entre **EspaÃ±ol e InglÃ©s**. El toggle solo cambia los textos y etiquetas de la UI; **no modifica las rutas** (todo permanece en el mismo path).
- [x] **SF-31:** El sitio carga **Google Analytics** y rastrea las visitas a pÃ¡ginas.

---

## Specs no funcionales

- [x] **SNF-01:** Performance â€” Las pÃ¡ginas pÃºblicas deben cargar con **p95 < 200ms** en el primer Contentful Paint (medido en Vercel Edge).
- [x] **SNF-02:** Performance â€” **Lighthouse score > 90** en Performance, Accessibility y Best Practices.
- [x] **SNF-03:** Seguridad â€” Las contraseÃ±as se almacenan con **bcrypt** (via Auth.js).
- [x] **SNF-04:** Seguridad â€” Todas las consultas a DB usan **Prisma parameterized queries** (protecciÃ³n SQL injection).
- [x] **SNF-05:** Seguridad â€” **Rate limiting** activo en `/api/contact` y endpoints de autenticaciÃ³n.
- [x] **SNF-06:** Seguridad â€” Todos los inputs de API se validan con **Zod** antes de procesar.
- [x] **SNF-07:** Seguridad â€” Las credenciales de email y API keys se leen exclusivamente de **variables de entorno** (process.env), nunca del cÃ³digo.
- [x] **SNF-08:** Seguridad â€” Las rutas del panel admin (`/admin/*`) redirigen a login si el usuario no estÃ¡ autenticado.
- [x] **SNF-09:** Accesibilidad â€” El HTML es semÃ¡ntico, las imÃ¡genes tienen **alt text**, y la navegaciÃ³n es operable por teclado.
- [x] **SNF-10:** Responsive â€” El layout funciona correctamente en viewports desde **320px hasta 2560px** sin pÃ©rdida de funcionalidad.

---

## Reglas de negocio

- **RN-01:** **MÃ¡ximo 3 usuarios administradores** pueden tener acceso autorizado al panel. La lista de emails autorizados se configura **exclusivamente por variable de entorno** (no en cÃ³digo ni en DB).
- **RN-02:** La imagen del proyecto es **opcional**. Un proyecto puede crearse sin imagen y aÃ±adirse despuÃ©s mediante ediciÃ³n.
- **RN-03:** Los proyectos se listan siempre ordenados por **fecha de creaciÃ³n descendente**.
- **RN-04:** El formulario de contacto **NO procesa pagos**. Solo genera solicitudes de contacto.
- **RN-05:** El destinatario de las notificaciones por email y el nÃºmero de WhatsApp de la PYME se configuran **exclusivamente por variable de entorno** (no aparecen ni en cÃ³digo, ni en frontend, ni en logs).
- **RN-06:** El tema por defecto del sitio es **modo oscuro**.
- **RN-07:** El idioma por defecto del sitio es **EspaÃ±ol**.
- **RN-08:** Solo los proyectos con estado **"publicado"** son visibles en la galerÃ­a pÃºblica. Los proyectos en **"oculto"** o **"borrador"** solo se ven en el panel admin.
- **RN-09:** Un proyecto nuevo se crea con estado **"borrador"** por defecto.
- **RN-10:** La respuesta del admin a una solicitud queda **registrada en la base de datos** asociada a la solicitud original, independientemente del canal usado (WhatsApp o Email).

---

## Casos borde / errores

- [x] **CB-01:** Input invÃ¡lido en formulario de contacto â€” el sistema muestra errores de validaciÃ³n especÃ­ficos por campo (Zod).
- [x] **CB-02:** Formulario de contacto enviado vacÃ­o â€” se rechaza con errores de validaciÃ³n en todos los campos requeridos.
- [x] **CB-03:** Fallo al subir imagen a Cloudinary â€” el panel muestra mensaje de error claro y permite reintentar.
- [x] **CB-04:** Servicio de email (Resend) caÃ­do â€” el formulario de contacto guarda la solicitud en DB pero la notificaciÃ³n por email falla sin bloquear al usuario. La solicitud y sus datos siguen siendo accesibles desde el panel admin para visualizaciÃ³n/descarga.
- [x] **CB-05:** Usuario no autenticado intenta acceder a `/admin/*` â€” redirigido a `/admin/login` con cÃ³digo 302.
- [x] **CB-06:** Rate limit excedido en formulario o login â€” el endpoint responde con **HTTP 429** e incluye cabecera `Retry-After`.
- [x] **CB-07:** Concurrencia â€” dos administradores modifican el mismo proyecto simultÃ¡neamente. La Ãºltima escritura prevalece sin corrupciÃ³n de datos.
- [x] **CB-08:** Preferencias de tema e idioma â€” al recargar la pÃ¡gina, la preferencia del usuario persiste (localStorage o cookie).
- [x] **CB-09:** Fallo de conexiÃ³n a base de datos â€” el sitio pÃºblico muestra una pÃ¡gina de error amigable, no una traza interna.
- [x] **CB-10:** Servicio de WhatsApp caÃ­do al enviar notificaciÃ³n â€” la solicitud se guarda en DB igualmente, el error se registra en logs, y la info sigue disponible en el panel admin.
- [x] **CB-11:** Proyecto creado sin imagen â€” el proyecto se crea correctamente, aparece en el panel, y en la galerÃ­a pÃºblica se muestra sin imagen (placeholder o layout alternativo).
- [x] **CB-12:** Admin elimina un proyecto publicado â€” el proyecto desaparece de la galerÃ­a pÃºblica inmediatamente.

---

## Roles y permisos

| Rol                | Puede ver                           | Puede modificar                 | Puede crear | Puede borrar |
| ------------------ | ----------------------------------- | ------------------------------- | ----------- | ------------ |
| Visitante anÃ³nimo | Landing page, proyectos pÃºblicos   | â€”                             | â€”         | â€”          |
| Administrador      | Panel admin, solicitudes, proyectos | Solicitudes (estado), proyectos | Proyectos   | Proyectos    |

---

## Datos sensibles (PII / regulado)

- **Email del visitante** â€” recogido en formulario de contacto. No expuesto pÃºblicamente. Solo visible en panel admin.
- **TelÃ©fono del visitante** â€” recogido en formulario de contacto. No expuesto pÃºblicamente. Solo visible en panel admin.
- **Email de notificaciÃ³n** (mitzustudioscl@gmail.com) â€” SOLO en variable de entorno. Nunca en cÃ³digo, frontend, logs o repositorio.
- **Credenciales de administradores** â€” hasheadas con bcrypt via Auth.js. Nunca en texto plano.

---

## Fuera de alcance (explÃ­cito)

- Pagos / pasarela de pago
- Blog o secciÃ³n de noticias
- MÃºltiples imÃ¡genes por proyecto (solo 1)
- Registro pÃºblico de usuarios
- Roles mÃ¡s complejos (solo admin Ãºnico nivel)
- Panel de analytics / estadÃ­sticas
- API pÃºblica para terceros
- Testimonios de clientes
- Chat en vivo / atenciÃ³n en tiempo real (solo notificaciones unidireccionales)
- ValidaciÃ³n de entrega de mensajes WhatsApp (solo envÃ­o best-effort)

---

## Criterios de aceptaciÃ³n

- [x] **CA-01:** La landing page carga y muestra las 5 secciones (Hero, Sobre MÃ­, Servicios, Proyectos, Contacto) sin errores.
- [x] **CA-02:** El formulario de contacto rechaza campos invÃ¡lidos con mensajes especÃ­ficos y no envÃ­a si hay errores.
- [x] **CA-03:** Una solicitud de contacto exitosa guarda el registro en DB, envÃ­a email de notificaciÃ³n al destinatario configurado y envÃ­a WhatsApp al nÃºmero PYME configurado.
- [x] **CA-04:** El panel admin rechaza acceso no autenticado y redirige a `/admin/login`.
- [x] **CA-05:** Login con credenciales correctas crea sesiÃ³n y redirige al dashboard del panel.
- [x] **CA-06:** Login con credenciales incorrectas muestra error y no crea sesiÃ³n.
- [x] **CA-07:** El admin puede ver el listado de solicitudes, marcar como leÃ­da, y responder desde el panel.
- [x] **CA-08:** El admin puede crear, editar y eliminar proyectos desde el panel.
- [x] **CA-09:** El admin puede subir una imagen a Cloudinary desde el panel y asociarla a un proyecto.
- [x] **CA-10:** El toggle de tema cambia entre modo oscuro y claro; el modo oscuro es el predeterminado.
- [x] **CA-11:** El toggle de idioma cambia el contenido entre espaÃ±ol e inglÃ©s sin recargar la pÃ¡gina.
- [x] **CA-12:** Las tarjetas de proyecto muestran tÃ­tulo, descripciÃ³n, imagen y tecnologÃ­as con iconos y enlaces.
- [x] **CA-13:** El sitio carga en viewports de 320px, 768px y 1440px sin desbordamiento horizontal ni pÃ©rdida de contenido.
- [x] **CA-14:** Lighthouse score > 90 en Performance, Accessibility y Best Practices.
- [x] **CA-15:** El rate limit en `/api/contact` responde 429 tras exceder el lÃ­mite configurado.
- [x] **CA-16:** Al seleccionar "Otro" en Tipo de Proyecto, aparece un campo de texto para describir el tipo.
- [x] **CA-17:** Tras enviar una solicitud, el cliente ve un mensaje indicando que recibirÃ¡ una cotizaciÃ³n por WhatsApp o email.
- [x] **CA-18:** El admin puede responder una solicitud seleccionando el canal (WhatsApp o Email) y la respuesta queda registrada en la DB.
- [x] **CA-19:** Un proyecto se crea con estado "borrador" por defecto y no aparece en la galerÃ­a pÃºblica hasta que se publique.
- [x] **CA-20:** El admin puede cambiar el estado de un proyecto a publicado, oculto o borrador desde el panel.
- [x] **CA-21:** Un proyecto sin imagen se muestra correctamente en la galerÃ­a con un placeholder.

---

## Dependencias externas

| Servicio / LibrerÃ­a           | VersiÃ³n (referencia)              | PropÃ³sito                                             |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------ |
| Next.js                        | 16 (App Router)                    | Framework frontend + API routes                        |
| shadcn/ui                      | Ãšltima compatible con Tailwind v4 | Componentes UI                                         |
| Tailwind CSS                   | v4                                 | Estilos utilitarios                                    |
| Prisma                         | Ãšltima estable                    | ORM + migraciones                                      |
| PostgreSQL (Neon/Supabase)     | Serverless                         | Base de datos                                          |
| Auth.js (NextAuth)             | v5                                 | AutenticaciÃ³n email+password                          |
| Resend                         | Ãšltima estable                    | EnvÃ­o de emails transaccionales                       |
| Cloudinary                     | Ãšltima estable                    | Almacenamiento y entrega de imÃ¡genes                  |
| Zod                            | Ãšltima estable                    | ValidaciÃ³n de esquemas                                |
| WhatsApp Business API / Twilio | Ãšltima estable                    | Notificaciones WhatsApp a PYME y respuestas a clientes |
| Google Analytics               | v4 (GA4)                           | Analytics de visitas                                   |
| Zustand                        | Ãšltima estable                    | Estado global del cliente                              |
| React Hook Form                | Ãšltima estable                    | Manejo de formularios                                  |
| Vitest                         | Ãšltima estable                    | Testing unitario                                       |

---

## Asunciones (necesitan confirmaciÃ³n si cambian)

- Las 5 secciones de la landing page estÃ¡n en una sola pÃ¡gina (scroll), no en rutas separadas.
- Los 3 usuarios administradores se configuran **exclusivamente por variable de entorno** (lista de emails autorizados), no hay registro pÃºblico.
- El tipo de proyecto en el formulario es un **select** con las opciones definidas; "Otro" revela un campo de texto.
- Las tecnologÃ­as en cada proyecto se almacenan como array de objetos con nombre, icono y URL opcional (GitHub).
- El admin puede responder solicitudes por **WhatsApp o Email** (elige el canal al responder). La respuesta queda registrada en DB.
- Google Analytics se carga solo en producciÃ³n (no en desarrollo).
- El toggle de idioma solo cambia textos/labels, no modifica rutas.
- El servicio de WhatsApp (Twilio o similar) requiere configuraciÃ³n de variables de entorno (API key, nÃºmero destino).
- Los proyectos tienen estado: publicado / oculto / borrador. Solo "publicado" aparece en galerÃ­a pÃºblica.

---

## Trazabilidad specs â†’ escenarios BDD

| Spec            | Escenario(s)                                                                    | Archivo                                               |
| --------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------- |
| SF-01           | "La landing page carga con las 5 secciones"                                     | features/landing.feature                              |
| SF-02           | "La landing page carga con las 5 secciones"                                     | features/landing.feature                              |
| SF-03           | "La landing page carga con las 5 secciones"                                     | features/landing.feature                              |
| SF-04           | "La landing page carga con las 5 secciones"                                     | features/landing.feature                              |
| SF-05           | "La landing page carga con las 5 secciones"                                     | features/landing.feature                              |
| SF-06           | "EnvÃ­o exitoso del formulario de contacto", "Campos invÃ¡lidos en formulario"  | features/contact.feature                              |
| SF-07           | "Campos invÃ¡lidos en formulario de contacto"                                   | features/contact.feature                              |
| SF-08           | "EnvÃ­o exitoso del formulario de contacto"                                     | features/contact.feature                              |
| SF-09           | "EnvÃ­o exitoso del formulario de contacto", "Fallo del servicio de email"      | features/contact.feature                              |
| SF-10           | "Rate limit excedido en formulario de contacto"                                 | features/contact.feature                              |
| SF-11           | "VisualizaciÃ³n de tarjetas de proyecto"                                        | features/projects.feature                             |
| SF-12           | "VisualizaciÃ³n de tarjetas de proyecto"                                        | features/projects.feature                             |
| SF-13           | "Login con credenciales correctas", "Login con credenciales incorrectas"        | features/admin-auth.feature                           |
| SF-14           | "Login con credenciales correctas" (verifica users permitidos)                  | features/admin-auth.feature                           |
| SF-15           | "Logout del panel admin"                                                        | features/admin-auth.feature                           |
| SF-16           | "SesiÃ³n persiste al recargar pÃ¡gina"                                          | features/admin-auth.feature                           |
| SF-17           | "Rate limit en login excedido"                                                  | features/admin-auth.feature                           |
| SF-18           | "Visualizar listado de solicitudes"                                             | features/admin-requests.feature                       |
| SF-19           | "Marcar solicitud como leÃ­da/no leÃ­da"                                        | features/admin-requests.feature                       |
| SF-20           | "Responder a una solicitud desde el panel"                                      | features/admin-requests.feature                       |
| SF-21           | "Filtrar solicitudes por estado"                                                | features/admin-requests.feature                       |
| SF-22           | "Crear un proyecto nuevo"                                                       | features/admin-projects.feature                       |
| SF-23           | "Editar un proyecto existente"                                                  | features/admin-projects.feature                       |
| SF-24           | "Eliminar un proyecto existente"                                                | features/admin-projects.feature                       |
| SF-25           | "Subir imagen a Cloudinary desde el panel"                                      | features/admin-projects.feature                       |
| SF-26           | "Visualizar listado de proyectos ordenados por fecha"                           | features/admin-projects.feature                       |
| SF-27           | "Cambiar entre modo oscuro y claro"                                             | features/theme.feature                                |
| SF-28           | "Animaciones en elementos de la pÃ¡gina"                                        | features/landing.feature                              |
| SF-29           | "Responsive en viewports mobile, tablet y desktop"                              | features/landing.feature                              |
| SF-30           | "Cambiar idioma entre espaÃ±ol e inglÃ©s"                                       | features/i18n.feature                                 |
| SF-31           | "Google Analytics se carga en producciÃ³n"                                      | features/landing.feature                              |
| SF-32           | "Cliente selecciona 'Otro' en tipo de proyecto y escribe descripciÃ³n"          | features/contact.feature                              |
| SF-33           | "Nueva solicitud dispara notificaciÃ³n WhatsApp a PYME"                         | features/admin-requests.feature                       |
| SF-34           | "Al enviar solicitud se notifica que serÃ¡ contactado por WhatsApp"             | features/contact.feature                              |
| SF-35           | "GalerÃ­a solo muestra proyectos publicados"                                    | features/projects.feature                             |
| SF-36           | "Admin responde solicitud vÃ­a WhatsApp"                                        | features/admin-requests.feature                       |
| SF-37           | "Admin responde solicitud vÃ­a Email"                                           | features/admin-requests.feature                       |
| SF-38           | "Proyecto se crea como borrador", "Proyecto se publica/oculta desde el panel"   | features/admin-projects.feature                       |
| SF-39           | "Proyecto se publica/oculta desde el panel"                                     | features/admin-projects.feature                       |
| SF-40           | "Filtrar proyectos por estado en el panel"                                      | features/admin-projects.feature                       |
| SNF-01 a SNF-10 | (Cubiertos indirectamente por tests de performance y seguridad)                 | â€”                                                   |
| CB-01           | "Campos invÃ¡lidos en formulario de contacto"                                   | features/contact.feature                              |
| CB-02           | "Campos invÃ¡lidos en formulario de contacto"                                   | features/contact.feature                              |
| CB-03           | "Fallo al subir imagen a Cloudinary"                                            | features/admin-projects.feature                       |
| CB-04           | "Fallo del servicio de email al enviar notificaciÃ³n"                           | features/contact.feature                              |
| CB-05           | "Acceso no autenticado al panel admin"                                          | features/admin-auth.feature                           |
| CB-06           | "Rate limit excedido en formulario de contacto", "Rate limit en login excedido" | features/contact.feature, features/admin-auth.feature |
| CB-07           | "Concurrencia al editar proyectos"                                              | features/admin-projects.feature                       |
| CB-08           | "Preferencias de tema persisten al recargar"                                    | features/theme.feature                                |
| CB-09           | "Fallo de conexiÃ³n a base de datos"                                            | features/landing.feature                              |
| CB-10           | "Fallo del servicio de WhatsApp al enviar notificaciÃ³n"                        | features/contact.feature                              |
| CB-11           | "Crear proyecto sin imagen"                                                     | features/admin-projects.feature                       |
| CB-12           | "Admin elimina un proyecto"                                                     | features/admin-projects.feature                       |

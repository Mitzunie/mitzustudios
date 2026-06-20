# Review - MitzuStudios Portfolio

## Veredicto actual (iteracion #2)

- Bloqueantes abiertos: 0
- Bloqueantes resueltos en este ciclo: 3
- Regresiones detectadas: 0
- Mejoras: 5 (M-01 a M-05, M-03 resuelto como bonus)
- Nits: 4 (N-01 a N-04)

**Recomendacion al composer: CONTINUAR PIPELINE (0 bloqueantes abiertos)**

---

## Tracker de bloqueantes (estado a traves de iteraciones)

| ID | Origen | Iter #1 | Iter #2 | Archivo:linea | Notas |
|----|--------|---------|---------|---------------|-------|
| B-01 | #1 | open | attacked - resolved | Footer.tsx:7 | Email reemplazado por NEXT_PUBLIC_CONTACT_EMAIL |
| B-02 | #1 | open | attacked - resolved | auth.config.ts:19-26 | authorized callback verifica ADMIN_EMAILS |
| B-03 | #1 | open | attacked - resolved | auth.config.ts:64-67 | IP real extralda de headers |

---

## Iteracion #2 (actual) - 2026-06-20
> Base del diff: d9e3a72
> Cambios revisados desde iteracion #1: 4 archivos, +33 -13 lineas
> Reporte del coder de este ciclo: ataco B-01, B-02, B-03 y M-03

## Resumen ejecutivo

### Lo que esta bien (especifico)

- **B-01 resuelto correctamente:** El email hardcodeado ha sido eliminado de Footer.tsx. Se lee de process.env.NEXT_PUBLIC_CONTACT_EMAIL.
- **B-02 resuelto correctamente:** El callback authorized en auth.config.ts ahora verifica ADMIN_EMAILS antes de permitir acceso a /admin/*.
- **B-03 resuelto correctamente:** Ahora se extrae la IP real desde headers x-forwarded-for y x-real-ip en el authorize callback.
- **M-03 resuelto como bonus:** La linea duplicada del primer servicio en el Footer fue eliminada.

### Observacion menor (no bloqueante)

- Footer.tsx usa process.env.NEXT_PUBLIC_CONTACT_EMAIL en vez de env.NEXT_PUBLIC_CONTACT_EMAIL. Funcionalmente identico.

---

## Adherencia a specs (actualizado)

| Spec | Estado anterior | Estado actual | Notas |
|------|----------------|---------------|-------|
| SNF-07 / RN-05 / Datos sensibles | B-01 | OK | Email ya no hardcodeado |
| D-01 / SNF-08 / SF-14 | B-02 | OK | Middleware verifica ADMIN_EMAILS |
| SF-17 / SNF-05 | B-03 | OK | IP real en rate limiter login |

---

## Re-verificacion de bloqueantes

### B-01: Email hardcodeado en Footer - RESUELTO

- **Estado:** attacked - resolved
- **Archivo:** Footer.tsx:7
- **Fix aplicado:** Reemplazado email hardcodeado por variable de entorno NEXT_PUBLIC_CONTACT_EMAIL
- **Verificacion:**
  - Email hardcodeado eliminado de Footer.tsx
  - .env.example actualizado con el placeholder
  - env.ts declara NEXT_PUBLIC_CONTACT_EMAIL como optional - correcto por ser email publico
  - Renderizado condicional - si no hay env var, no se muestra la seccion

### B-02: Middleware no verifica ADMIN_EMAILS - RESUELTO

- **Estado:** attacked - resolved
- **Archivo:** auth.config.ts:19-26
- **Fix aplicado:** Nuevo bloque en authorized callback que verifica ADMIN_EMAILS antes de permitir acceso
- **Verificacion:**
  - Usuario sin email en ADMIN_EMAILS es redirigido a /
  - Verificacion ANTES del resto de la logica - orden correcto
  - Deny by default si ADMIN_EMAILS no esta configurado
  - Consistente con requireAdmin en API routes

### B-03: Rate limiter login con IP hardcodeada - RESUELTO

- **Estado:** attacked - resolved
- **Archivo:** auth.config.ts:64-67
- **Fix aplicado:** Extraccion de IP real desde headers del request
- **Verificacion:**
  - request es segundo parametro de authorize - API correcta de Auth.js v5
  - x-forwarded-for - primer IP del chain - con fallback a x-real-ip
  - Fallback a 'unknown' seguro si no hay headers
  - En Vercel/produccion, x-forwarded-for siempre presente

---

## Nuevos bloqueantes

**Ninguno.** Los 3 fixes son limpios, correctos, y no introducen regresiones.

---

## Mejoras (de iteracion #1, sin cambios)

### M-01: useTranslations usa as unknown as Dictionary - riesgo de rotura silenciosa
### M-02: Rate limiter no usa env vars validadas
### M-03: RESUELTO - servicio duplicado eliminado del Footer
### M-04: Faltan tests para endpoints admin PATCH/DELETE projects y respond
### M-05: force-dynamic en landing page impide optimizacion RSC total

## Nits (de iteracion #1, sin cambios)

### N-01: Catch blocks silenciosos en varios componentes cliente
### N-02: (window as any).gtag sin tipo definido
### N-03: Paginacion solo en backend, sin controles en frontend
### N-04: handleDelete usa window.confirm en vez de un dialogo accesible
---

## Metricas

- Tests: ~121 (sin cambios en este ciclo)
- Cobertura: Sin cambios
- Cambios: 4 archivos, +33 -13 lineas

---

## Output al composer

'''
reviewer completado (iteracion #2).

Archivo: .composer/review.md

Veredicto: CONTINUAR PIPELINE (0 bloqueantes abiertos)

Cambios desde iteracion #1:
- B-01 - resolved (Footer.tsx:7 - email leido de NEXT_PUBLIC_CONTACT_EMAIL)
- B-02 - resolved (auth.config.ts:19-26 - middleware verifica ADMIN_EMAILS)
- B-03 - resolved (auth.config.ts:64-67 - IP real desde headers HTTP)
- M-03 - resolved (Footer.tsx:20 - servicio duplicado eliminado)

Bloqueantes nuevos: 0
Regresiones: 0

Estado del tracker: todos cerrados.

Recomendacion: continuar a ci-cd.
'''


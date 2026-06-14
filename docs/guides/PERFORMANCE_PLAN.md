# Plan de Performance — GraceHub (Revisado)

> **Objetivo:** Eliminar la lentitud al navegar entre pestañas en producción.  
> **Causa raíz:** El frontend solicita tablas completas (`getAllAttendanceRecords`, `getAllMeetings`, `getAllMembersNonPaginated`) en cada render. El backend ejecuta `SELECT *` sin filtros. La solución es invertir la responsabilidad: el backend calcula y agrega, el frontend pide solo lo que necesita mostrar.

---

## Contexto del problema

Cada navegación en el admin dispara hasta 6 requests paralelos que retornan **todas las filas** de las tablas principales:

| Endpoint actual | Uso en frontend | Problema |
|---|---|---|
| `GET /attendance` | Dashboard KPIs, Eventos KPIs, Miembros tab asistencia | `SELECT *` sin límite — crece ilimitado |
| `GET /meetings` | Dashboard, Eventos (conteo por serie), Miembros | Retorna todas las instancias |
| `GET /members` (non-paginated) | Dashboard, Grupos, Tithes, GDI admin, Área admin | Retorna todos los miembros con joins |
| `GET /meeting-series` | Dashboard, Eventos, Miembros | Liviano, aceptable |
| `GET /gdis` | Dashboard, Grupos, Eventos | Liviano, aceptable |
| `GET /areas` | Grupos, Eventos | Liviano, aceptable |

---

## Estrategia: dos fases independientes

### Fase 1 — Backend: endpoints de agregación (grace-hub-service)
### Fase 2 — Frontend: `unstable_cache` con invalidación por tags (grace-hub)

Las fases son independientes. La Fase 1 tiene mayor impacto porque reduce el payload en la red y el procesamiento en el servidor de Next.js. La Fase 2 es complementaria: evita requests repetidos dentro de la ventana de caché.

---

## FASE 1 — Backend: Endpoints de Agregación

### Reglas de arquitectura aplicadas (grace-hub-service)

Cada nuevo endpoint sigue el flujo estricto de Clean Architecture:

```
Controller (Presentation)
  → ApplicationService (Application)
    → UseCase (Application)
      → IRepository (Domain — interfaz)
        → RepositoryImpl (Infrastructure — implementación SQL)
```

- Los nuevos métodos de repositorio van en `IAttendanceRepository` / `IMeetingRepository`
- Las implementaciones SQL van en `AttendanceRepositoryImpl` / `MeetingRepositoryImpl`
- Los nuevos Use Cases van en `application/use-cases/`
- Los nuevos DTOs van en `presentation/dtos/`
- Los Controllers solo manejan HTTP — no lógica

---

### 1.1 — `GET /attendance/stats?meetingIds[]=X&meetingIds[]=Y`

**Propósito:** Reemplaza `GET /attendance` para los KPIs de dashboard y eventos. En vez de retornar todos los registros, retorna conteos pre-calculados por `meeting_id`.

**Archivos a crear/modificar:**

```
grace-hub-service/src/modules/attendance/
├── domain/repositories/
│   └── attendance.repository.interface.ts      ← MODIFICAR: agregar findStatsByMeetings()
├── infrastructure/persistence/typeorm/
│   └── attendance.repository.impl.ts           ← MODIFICAR: implementar con SQL agregado
├── application/use-cases/get-attendance/
│   └── get-attendance-stats.use-case.ts        ← CREAR
├── application/services/
│   └── attendance-application.service.ts       ← MODIFICAR: exponer getAttendanceStats()
└── presentation/
    ├── dtos/
    │   └── attendance-stats-response.dto.ts    ← CREAR
    └── controllers/
        └── attendance.controller.ts            ← MODIFICAR: agregar GET /stats
```

**Contrato del endpoint:**

```
GET /api/v1/attendance/stats?meetingIds=1,2,3,4,5

Response:
[
  {
    "meetingId": 1,
    "presentCount": 18,
    "absentCount": 4,
    "totalExpected": 22
  },
  ...
]
```

**SQL de la implementación (IAttendanceRepository):**

```sql
-- Método: findStatsByMeetings(meetingIds: number[])
SELECT
  meeting_id,
  COUNT(*) FILTER (WHERE was_present = true)  AS present_count,
  COUNT(*) FILTER (WHERE was_present = false) AS absent_count,
  COUNT(*)                                    AS total_expected
FROM attendance
WHERE meeting_id = ANY($1::int[])
GROUP BY meeting_id
```

---

### 1.2 — `GET /meetings/count-by-series`

**Propósito:** Reemplaza `GET /meetings` en el toolbar de Eventos y Dashboard. Solo necesitamos el conteo de instancias por `series_id`, no las instancias completas.

**Archivos a crear/modificar:**

```
grace-hub-service/src/modules/meetings/
├── domain/repositories/
│   └── meeting.repository.interface.ts         ← MODIFICAR: agregar countBySeries()
├── infrastructure/persistence/typeorm/
│   └── meeting.repository.impl.ts              ← MODIFICAR: implementar con SQL agregado
├── application/use-cases/get-meeting/
│   └── get-meetings-count-by-series.use-case.ts ← CREAR
├── application/services/
│   └── meetings-application.service.ts          ← MODIFICAR: exponer countBySeries()
└── presentation/
    ├── dtos/
    │   └── meetings-count-by-series-response.dto.ts ← CREAR
    └── controllers/
        └── meetings.controller.ts               ← MODIFICAR: agregar GET /count-by-series
```

**Contrato del endpoint:**

```
GET /api/v1/meetings/count-by-series

Response:
[
  { "seriesId": 1, "count": 52 },
  { "seriesId": 2, "count": 12 },
  ...
]
```

**SQL:**

```sql
-- Método: countBySeries()
SELECT series_id, COUNT(*) AS count
FROM meetings
WHERE series_id IS NOT NULL
GROUP BY series_id
```

---

### 1.3 — `GET /members/count` y `GET /members/summary`

**Propósito:** El Dashboard necesita el total de miembros activos y la distribución por rol. No necesita los 200 objetos completos con joins.

**Archivos a crear/modificar:**

```
grace-hub-service/src/modules/members/
├── domain/repositories/
│   └── member.repository.interface.ts          ← MODIFICAR: agregar countActive(), getRoleSummary()
├── infrastructure/persistence/typeorm/
│   └── member.repository.impl.ts               ← MODIFICAR: implementar SQL agregado
├── application/use-cases/get-member/
│   ├── get-member-count.use-case.ts            ← CREAR
│   └── get-member-role-summary.use-case.ts     ← CREAR
├── application/services/
│   └── member-application.service.ts           ← MODIFICAR
└── presentation/
    ├── dtos/
    │   ├── member-count-response.dto.ts         ← CREAR
    │   └── member-role-summary-response.dto.ts  ← CREAR
    └── controllers/
        └── members.controller.ts                ← MODIFICAR: agregar GET /count y GET /role-summary
```

**SQL para `countActive()`:**

```sql
SELECT COUNT(*) as total
FROM members
WHERE record_status = 'vigente'
```

**SQL para `getRoleSummary()`:**

```sql
SELECT
  COUNT(*) FILTER (WHERE EXISTS(SELECT 1 FROM gdis WHERE guide_id = m.member_id))   AS gdi_guides,
  COUNT(*) FILTER (WHERE EXISTS(SELECT 1 FROM gdis WHERE mentor_id = m.member_id))  AS gdi_mentors,
  COUNT(*) FILTER (WHERE EXISTS(SELECT 1 FROM areas WHERE leader_id = m.member_id)) AS area_leaders,
  COUNT(*) FILTER (WHERE EXISTS(SELECT 1 FROM areas WHERE mentor_id = m.member_id)) AS area_mentors
FROM members m
WHERE m.record_status = 'vigente'
```

---

## FASE 2 — Frontend: `unstable_cache` (grace-hub)

### Reglas de arquitectura aplicadas (grace-hub)

- Las páginas (`app/(protected)/*/page.tsx`) NO se modifican directamente para el cache
- El cache se agrega en la **capa de Services** (`src/lib/api/services/`) — que es la capa que las páginas consumen
- Las Server Actions ya tienen `revalidatePath` — se agrega `revalidateTag` a cada una
- Se crea UN archivo nuevo: `src/lib/api/services/cached-services.ts`

```
Pages (Server Components)
  → cached-services.ts      ← NUEVO: wrappers con unstable_cache
    → Services existentes   ← SIN CAMBIOS
      → Endpoints           ← SIN CAMBIOS
        → Client            ← SIN CAMBIOS
```

---

### 2.1 — Crear `src/lib/api/services/cached-services.ts`

```typescript
import { unstable_cache } from 'next/cache';
import {
  getAllMeetingSeries,
  getAllGdis,
  getAllMinistryAreas,
  getAllRoleTypes,
  // nuevos de Fase 1:
  getMeetingsCountBySeries,
  getAttendanceStatsByMeetings,
  getMembersCount,
  getMemberRoleSummary,
} from './index';

export const getCachedMeetingSeries = unstable_cache(
  () => getAllMeetingSeries(),
  ['meeting-series'],
  { revalidate: 60, tags: ['meeting-series'] }
);

export const getCachedGdis = unstable_cache(
  () => getAllGdis(),
  ['gdis'],
  { revalidate: 60, tags: ['gdis'] }
);

export const getCachedMinistryAreas = unstable_cache(
  () => getAllMinistryAreas(),
  ['ministry-areas'],
  { revalidate: 60, tags: ['ministry-areas'] }
);

export const getCachedRoleTypes = unstable_cache(
  () => getAllRoleTypes(),
  ['role-types'],
  { revalidate: 300, tags: ['role-types'] } // cambia muy poco
);

// Estos reemplazan getAllMeetings() y getAllAttendanceRecords() en páginas de listado
export const getCachedMeetingsCountBySeries = unstable_cache(
  () => getMeetingsCountBySeries(),
  ['meetings-count-by-series'],
  { revalidate: 60, tags: ['meetings'] }
);
```

> **Nota:** `getAllMembersNonPaginated()` NO se cachea aquí — las páginas que lo usan para dropdowns de asignación (grupos, tithes) deben seguir consumiéndolo directo o usar el endpoint `/members/summary` de Fase 1.

---

### 2.2 — Agregar `revalidateTag` en Server Actions

Cada Server Action que muta datos agrega el tag correspondiente además del `revalidatePath` existente:

**`eventActions.ts`** — agrega `revalidateTag('meeting-series')` y `revalidateTag('meetings')` en las acciones que crean/modifican series e instancias.

**`groupActions.ts`** — agrega `revalidateTag('gdis')` y `revalidateTag('ministry-areas')`.

**`memberActions.ts`** — agrega `revalidateTag('members')` (para cuando se implemente el cache de members en Fase 1).

**Ejemplo de patrón:**

```typescript
// ANTES
revalidatePath("/events");

// DESPUÉS
revalidatePath("/events");
revalidateTag('meeting-series');
revalidateTag('meetings');
```

---

### 2.3 — Actualizar páginas para usar cached-services

Las páginas reemplazan las importaciones de alto costo:

| Página | Reemplaza | Por |
|---|---|---|
| `events/page.tsx` | `getAllMeetings()` para el conteo | `getCachedMeetingsCountBySeries()` |
| `events/page.tsx` | `getAllAttendanceRecords()` para KPIs | `getAttendanceStatsByMeetings(meetingIds)` (Fase 1) |
| `events/page.tsx` | `getAllMeetingSeries()` | `getCachedMeetingSeries()` |
| `page.tsx` (dashboard) | `getAllMeetingSeries()`, `getAllGdis()` | versiones cached |
| `groups/page.tsx` | `getAllGdis()`, `getAllMinistryAreas()` | versiones cached |
| `members/page.tsx` | `getAllMeetingSeries()`, `getAllGdis()` | versiones cached |

> **No se elimina `force-dynamic` de ninguna página** — sigue siendo necesario para la autenticación por cookie. `unstable_cache` es ortogonal a `force-dynamic` y funciona correctamente con él.

---

## Orden de implementación recomendado

```
[ ] PASO 1: GET /attendance/stats         (grace-hub-service) — mayor impacto
[ ] PASO 2: GET /meetings/count-by-series (grace-hub-service)
[ ] PASO 3: GET /members/count            (grace-hub-service) — para dashboard
[ ] PASO 4: Agregar endpoints al frontend  (grace-hub — endpoint + mapper + service)
[ ] PASO 5: cached-services.ts            (grace-hub)
[ ] PASO 6: revalidateTag en actions      (grace-hub)
[ ] PASO 7: Actualizar páginas            (grace-hub)
```

Los pasos 1–3 son independientes entre sí y pueden hacerse en paralelo.
Los pasos 4–7 dependen de que los pasos anteriores estén deployados en producción.

---

## Resultado esperado

| Situación | Antes | Después |
|---|---|---|
| Primera navegación del día | ~3–8s (cold data fetch) | ~1–2s (menos payload) |
| Navegaciones siguientes | ~2–4s (force-dynamic, sin cache) | ~200ms (unstable_cache hit) |
| Mutación (agregar miembro) | `revalidatePath` invalida la ruta | `revalidateTag` invalida solo los datos afectados |
| Payload de `/events` | todos los attendance records | solo conteos por meeting_id del rango seleccionado |

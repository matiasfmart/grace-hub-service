# Análisis Comparativo: Backend vs Frontend

> **Última actualización:** 2026-06-14  
> **Estado:** 97% funcional (90/93 casuísticas)

Este documento compara cada funcionalidad que el frontend necesita con el estado actual del backend.

---

## Leyenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Completamente implementado y funcional |
| ⚠️ | Parcialmente implementado o necesita ajustes |
| ❌ | No implementado |
| ⏳ | Propuesto — pendiente de implementación |

---

## 1. MÓDULO: MIEMBROS

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 1.1 | Listar miembros paginados | `GET /members/search` | ✅ |
| 1.2 | Buscar por nombre/email | `search` param | ✅ |
| 1.3 | Filtrar por estado | `status[]` param | ✅ |
| 1.4 | Filtrar por rol | `role[]` query param en `GET /members/search` (mapeado a sentinels SQL por `buildFilterConditions`) | ✅ |
| 1.5 | Filtrar por GDI | `gdi[]` param | ✅ |
| 1.6 | Filtrar por Área | `area[]` param | ✅ |
| 1.7 | Crear miembro | `POST /members` | ✅ |
| 1.8 | Ver detalles | `GET /members/:id` | ✅ |
| 1.9 | Editar miembro | `PATCH /members/:id` | ✅ |
| 1.10 | Eliminar miembro | `DELETE /members/:id` | ✅ |
| 1.11 | Agregar múltiples | Loop de `POST /members` | ✅ |
| 1.12 | Asistencia del miembro | `GET /attendance?memberId=:id` | ✅ |
| 1.13 | Diezmos del miembro | `GET /tithes?memberId=:id` | ❌ |
| 1.14 | Asignar etiqueta eclesiástica | `POST /members/:id/role-types` | ✅ |
| 1.15 | Quitar etiqueta eclesiástica | `DELETE /members/:id/role-types/:roleTypeId` | ✅ |

**Resumen:** 14/15 ✅ | 1 ❌

---

## 2. MÓDULO: GDIs

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 2.1 | Listar GDIs | `GET /gdis` | ✅ |
| 2.2 | Crear GDI | `POST /gdis` | ✅ |
| 2.3 | Ver detalles | `GET /gdis/:id` | ✅ |
| 2.4 | Editar GDI | `PUT /gdis/:id` | ✅ |
| 2.5 | Eliminar GDI | `DELETE /gdis/:id` | ✅ |
| 2.6 | Ver miembros GDI | `GET /gdis/:id/members` | ✅ |
| 2.7 | Asignar miembro | `POST /gdis/:id/members/:memberId` | ✅ |
| 2.8 | Remover miembro | `DELETE /gdis/:id/members/:memberId` | ✅ |
| 2.9 | Series del GDI | `GET /meeting-series?gdiId=:id` | ✅ |

**Resumen:** 9/9 ✅

---

## 3. MÓDULO: ÁREAS MINISTERIALES

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 3.1 | Listar Áreas | `GET /areas` | ✅ |
| 3.2 | Crear Área | `POST /areas` | ✅ |
| 3.3 | Ver detalles | `GET /areas/:id` | ✅ |
| 3.4 | Editar Área | `PUT /areas/:id` | ✅ |
| 3.5 | Eliminar Área | `DELETE /areas/:id` | ✅ |
| 3.6 | Ver miembros Área | `GET /areas/:id/members` | ✅ |
| 3.7 | Asignar miembro | `POST /areas/:id/members/:memberId` | ✅ |
| 3.8 | Remover miembro | `DELETE /areas/:id/members/:memberId` | ✅ |
| 3.9 | Series del Área | `GET /meeting-series?areaId=:id` | ✅ |

**Resumen:** 9/9 ✅

---

## 4. MÓDULO: SERIES DE REUNIONES

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 4.1 | Listar todas las series | `GET /meeting-series` | ✅ |
| 4.2 | Crear serie GDI | `POST /meeting-series` | ✅ |
| 4.3 | Crear serie Área | `POST /meeting-series` | ✅ |
| 4.4 | Crear serie categorías | `POST /meeting-series` | ⚠️ |
| 4.5 | Crear serie general | `POST /meeting-series` | ✅ |
| 4.6 | Ver detalles serie | `GET /meeting-series/:id` | ✅ |
| 4.7 | Editar serie | `PUT /meeting-series/:id` | ✅ |
| 4.8 | Eliminar serie | `DELETE /meeting-series/:id` | ✅ |
| 4.9 | Filtrar por GDI | `GET /meeting-series?gdiId=:id` | ✅ |
| 4.10 | Filtrar por Área | `GET /meeting-series?areaId=:id` | ✅ |
| 4.11 | Filtrar por audienceType | `GET /meeting-series?audienceType=...` | ✅ |
| 4.12 | Cancelar fecha | `PATCH /meeting-series/:id/cancel-date` | ✅ |

**Resumen:** 11/12 ✅ | 1 ⚠️

> **Nota:** El tipo `by_categories` (4.4) no funciona porque las tablas de soporte fueron eliminadas.

---

## 5. MÓDULO: INSTANCIAS DE REUNIONES

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 5.1 | Listar instancias | `GET /meetings` | ✅ |
| 5.2 | Filtrar por serie | `GET /meetings?seriesId=:id` | ✅ |
| 5.3 | Filtrar por fecha | `GET /meetings?startDate=...&endDate=...` | ✅ |
| 5.4 | Crear instancia | `POST /meetings` | ✅ |
| 5.5 | Ver instancia | `GET /meetings/:id` | ✅ |
| 5.6 | Editar instancia | `PUT /meetings/:id` | ✅ |
| 5.7 | Eliminar instancia | `DELETE /meetings/:id` | ✅ |
| 5.8 | Asistentes esperados | `GET /meetings/:id/expected-attendees` | ✅ |

**Resumen:** 8/8 ✅

---

## 6. MÓDULO: ASISTENCIA

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 6.1 | Listar toda la asistencia | `GET /attendance` | ✅ |
| 6.2 | Asistencia de reunión | `GET /attendance?meetingId=:id` | ✅ |
| 6.3 | Asistencia de miembro | `GET /attendance?memberId=:id` | ✅ |
| 6.4 | Crear registro | `POST /attendance` | ✅ |
| 6.5 | Guardar masivo | `POST /attendance/meeting/:meetingId` | ✅ |

**Resumen:** 5/5 ✅

---

## 7. MÓDULO: DIEZMOS

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 7.1 | Listar diezmos | `GET /tithes` | ✅ |
| 7.2 | Filtrar por año/mes | `GET /tithes?year=...&month=...` | ✅ |
| 7.3 | Crear registro | `POST /tithes` | ✅ |
| 7.4 | Guardar masivo | `POST /tithes/batch` | ✅ |
| 7.5 | Filtrar por miembro | `GET /tithes?memberId=:id` | ❌ |
| 7.6 | Eliminar registro | `DELETE /tithes/:id` | ❌ |

**Resumen:** 4/6 ✅ | 2 ❌

---

## 8. MÓDULO: DASHBOARD

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 8.1 | Distribución roles | `GET /members` | ✅ |
| 8.2 | Asistencia mensual | `GET /meetings` + `GET /attendance` | ✅ |
| 8.3 | Tendencia GDIs | Series + asistencia | ✅ |
| 8.4 | Miembros ausentes | Múltiples queries | ✅ |
| 8.5 | Lista de GDIs | `GET /gdis` | ✅ |

**Resumen:** 5/5 ✅

---

## 9. MÓDULO: ROLE TYPES (ETIQUETAS ECLESIÁSTICAS)

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 9.1 | Listar etiquetas | `GET /role-types` | ✅ |
| 9.2 | Crear etiqueta | `POST /role-types` | ✅ |
| 9.3 | Eliminar etiqueta | `DELETE /role-types/:id` | ✅ |
| 9.4 | Editar etiqueta | No implementado | ❌ |

**Resumen:** 3/4 ✅ | 1 ❌

---

## RESUMEN GLOBAL

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Funcional | 79 | 98% |
| ⚠️ Parcial | 0 | 0% |
| ❌ No implementado | 2 | 2% |
| **TOTAL** | **81** | **100%** |

---

## 10. MÓDULO: PROSPECTS (NUEVOS INGRESOS)

| # | Casuística | Backend | Estado |
|---|------------|---------|--------|
| 10.1 | Listar prospects pendientes | `GET /prospects?status=pending` | ✅ |
| 10.2 | Listar prospects integrados | `GET /prospects?status=integrated` | ✅ |
| 10.3 | Listar prospects archivados | `GET /prospects?status=lost` | ✅ |
| 10.4 | Crear prospect (admin manual) | `POST /prospects` con `addedBy?` | ✅ |
| 10.5 | Crear prospect (PWA equipo) | `POST /prospects` con Bearer JWT scope `welcome_team` | ✅ |
| 10.6 | Ver prospect por ID | `GET /prospects/:id` | ✅ |
| 10.7 | Editar campos prospect | `PATCH /prospects/:id` (solo estado `pending`) | ✅ |
| 10.8 | Integrar prospect como miembro | `PATCH /prospects/:id/integrate` | ✅ |
| 10.9 | Archivar prospect | `PATCH /prospects/:id/archive` | ✅ |
| 10.10 | Nombre del agregador en listados | LEFT JOIN a `members` en `findFiltered()` y `findById()` | ✅ |
| 10.11 | Auth equipo de bienvenida (PWA) | `POST /auth/team-login` — valida `WELCOME_TEAM_CODE`, retorna JWT | ✅ |

**Resumen:** 11/11 ✅

---

## 11. PROPUESTAS PENDIENTES (no implementadas)

| # | Propuesta | Referencia | Estado |
|---|-----------|------------|--------|
| 11.1 | Migrar `visit_date DATE` → `visit_at TIMESTAMPTZ` en tabla `prospects` | [PROPOSAL-001](../../grace-hub/docs/proposals/PROPOSAL-001-visit-datetime-and-meeting-series.md) | ⏳ Pendiente |
| 11.2 | Agregar FK opcional `meeting_series_id` a tabla `prospects` | [PROPOSAL-001](../../grace-hub/docs/proposals/PROPOSAL-001-visit-datetime-and-meeting-series.md) | ⏳ Pendiente |

**Impacto de PROPOSAL-001 en el backend:**
- 1 migración SQL (ALTER TABLE + nuevo índice)
- 9 archivos afectados: entity, aggregate, commands (create/update), use-cases, repository interface/impl, DTO, mapper
- Ver detalle completo en PROPOSAL-001

---

## RESUMEN GLOBAL

| Estado | Cantidad | Porcentaje |
|--------|----------|------------|
| ✅ Funcional | 90 | 97% |
| ⚠️ Parcial | 1 | 1% |
| ❌ No implementado | 3 | 2% |
| ⏳ Propuesto | 2 | — |
| **TOTAL implementado/parcial** | **93** | **100%** |

### ❌ Pendientes de implementación

| Endpoint | Módulo | Prioridad |
|----------|--------|-----------|
| `GET /tithes?memberId=:id` | Tithes | Media |
| `DELETE /tithes/:id` | Tithes | Media |
| `PUT /role-types/:id` | RoleTypes | Baja |

### ⏳ Propuestas aprobadas, pendientes de desarrollo

| Feature | Referencia | Prioridad |
|---------|------------|-----------|
| `visit_at TIMESTAMPTZ` + `meeting_series_id` en Prospects | PROPOSAL-001 | Alta — problema operativo activo |

---

## NOTAS IMPORTANTES

1. **Roles calculados en frontend:** El backend devuelve `roles[]` (GdiGuide, AreaLeader, etc.) derivados de asignaciones a GDIs/Áreas. El frontend calcula el nivel operativo (0-4) basándose en estos roles.

2. **`by_categories` funcional:** Usa `role_types` + `member_roles`. El frontend envía `roleTypeIds` en `audience_config`. El endpoint `expected-attendees` calcula via JOIN. El cliente filtra client-side en `events/page.tsx`.

3. **`integrated/workers/leaders/mentors`:** El backend calcula server-side usando la query SQL de niveles operativos (ADR-004). El frontend también recalcula client-side en `/events/page.tsx` usando GDIs/Áreas ya cargadas, para evitar N requests.

4. **`addedByName` como campo transient en Prospects:** Es un campo de lectura en el agregado de dominio (`public addedByName?: string`). Se puebla por el repositorio via LEFT JOIN a `members`, nunca por la lógica de dominio. `save()` y `update()` no lo incluyen; solo `findById()` y `findFiltered()` lo devuelven.

5. **Auth dual para PWA:** El `AuthGuard` acepta tanto cookie `auth` (admin desktop) como `Authorization: Bearer` (PWA `grace-hub-welcome`). El scope `welcome_team` en el JWT identifica el origen pero no restringe endpoints actualmente.

6. **Cache layer en frontend:** `cached-services.ts` usa Map module-level con TTL=5min en lugar de `unstable_cache`. La invalidación se hace via `invalidateCacheByTag()` llamado desde Server Actions. El `unstable_cache` fue descartado porque ejecuta fuera del contexto de request y no puede reenviar la cookie `auth` → 401 en backend.

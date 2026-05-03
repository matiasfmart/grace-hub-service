# Grace Hub Service - Documentación

> **Última actualización:** 2026-05-01

## Índice

### Estado del Proyecto
- [REFACTORING_STATUS.md](../REFACTORING_STATUS.md) - Estado del refactoring a Clean Architecture

### Arquitectura
- [CLEAN_ARCHITECTURE.md](./architecture/CLEAN_ARCHITECTURE.md) - Explicación de capas y principios
- [ARCHITECTURE_RULES.md](./architecture/ARCHITECTURE_RULES.md) - Reglas por capa
- [MEETINGS_ARCHITECTURE.md](./architecture/MEETINGS_ARCHITECTURE.md) - Arquitectura del módulo de reuniones
- [AUTH_ARCHITECTURE.md](./architecture/AUTH_ARCHITECTURE.md) - Arquitectura del módulo de autenticación

### Análisis
- [BACKEND_FRONTEND_COMPARISON.md](./analysis/BACKEND_FRONTEND_COMPARISON.md) - Estado de endpoints vs frontend (98%)

### Guías
- [DEVELOPMENT_GUIDE.md](./guides/DEVELOPMENT_GUIDE.md) - Guía de desarrollo
- [STORED_PROCEDURES_EXAMPLES.sql](./guides/STORED_PROCEDURES_EXAMPLES.sql) - Ejemplos de stored procedures

### Decisiones de Arquitectura (ADR)
- ADR-007: Estrategia de Build en Producción — Por qué el Build Command de Render usa `--include=dev` y cómo migrar a Docker cuando corresponda *(ver `/docs-grace-hub/decisions/007-estrategia-build-produccion.md`)*

### Base de Datos
- [init-schema.sql](../init-schema.sql) - Schema SQL de inicialización

### Prompts
- [prompts.md](./prompts/prompts.md) - Prompts para desarrollo con IA

---

## Documentación Centralizada

> **Nota:** El directorio `docs-grace-hub/` se encuentra en la raíz del proyecto (`/docs-grace-hub/`), fuera de los workspaces individuales de `grace-hub/` y `grace-hub-service/`. Si no aparece en el workspace activo, abrirlo desde el directorio raíz del proyecto.

Para documentación funcional y de negocio, ver:

| Documento | Ubicación |
|-----------|-----------|
| Reglas de Negocio | [/docs-grace-hub/REGLAS_DE_NEGOCIO.md](../../docs-grace-hub/REGLAS_DE_NEGOCIO.md) |
| Schema Documentado | [/docs-grace-hub/DATABASE_SCHEMA.md](../../docs-grace-hub/DATABASE_SCHEMA.md) |
| Estado del Sistema | [/docs-grace-hub/SYSTEM_STATUS.md](../../docs-grace-hub/SYSTEM_STATUS.md) |
| Casos de Uso | [/docs-grace-hub/casos-de-uso/](../../docs-grace-hub/casos-de-uso/) |

---

## Módulos Implementados

| Módulo | Endpoints | Estado |
|--------|-----------|--------|
| Members | `/members` | ✅ Completo |
| GDIs | `/gdis` | ✅ Completo |
| Areas | `/areas` | ✅ Completo |
| Meetings | `/meetings` | ✅ Completo |
| Meeting Series | `/meeting-series` | ✅ Completo |
| Attendance | `/attendance` | ✅ Completo |
| Tithes | `/tithes` | ⚠️ Parcial |
| Role Types | `/role-types` | ✅ Completo |
| Auth | `/auth` | ✅ Completo |
| Prospects | `/prospects` | ✅ Completo |

### Módulos Pendientes

| Módulo | Descripción | Prioridad |
|--------|-------------|----------|
| RoleTypes edit | `PUT /role-types/:id` - Editar etiqueta | Baja |
| Tithes memberId | `GET /tithes?memberId=:id` - Ver diezmos de un miembro | Media |
| Tithes delete | `DELETE /tithes/:id` - Eliminar registro | Media |

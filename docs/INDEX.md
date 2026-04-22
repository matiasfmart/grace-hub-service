# Grace Hub Service - Documentación

> **Última actualización:** 2026-04-22

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

### Base de Datos
- [current_schema.sql](./current_schema.sql) - Schema SQL actual

### Prompts
- [prompts.md](./prompts/prompts.md) - Prompts para desarrollo con IA

---

## Documentación Centralizada

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

### Módulos Pendientes

| Módulo | Descripción | Prioridad |
|--------|-------------|----------|
| RoleTypes edit | `PUT /role-types/:id` - Editar etiqueta | Baja |

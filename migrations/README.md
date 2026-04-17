# Migraciones de Base de Datos

> **Última actualización:** 2026-04-16

## Estructura

```
migrations/
├── README.md           # Este archivo
├── executed/           # Scripts ya aplicados
│   ├── 001_add_roles_fix_constraints.sql
│   ├── 002_review_unused_tables.sql
│   ├── 003_fix_member_roles_constraints.sql
│   ├── 004_add_static_role_labels.sql
│   ├── 005_add_audience_types.sql
│   ├── 006_change_member_status.sql
│   ├── 007_fix_unique_constraints.sql
│   ├── 008_fix_unique_constraints_v2.sql
│   └── 009_recreate_member_roles_tithes.sql
└── pending/            # Scripts por ejecutar (vacío)
```

---

## Migraciones Ejecutadas

| # | Script | Fecha | Descripción |
|---|--------|-------|-------------|
| 001 | `add_roles_fix_constraints.sql` | 2026-04-16 | Creó `role_types` y `member_roles`, agregó FKs faltantes |
| 002 | `review_unused_tables.sql` | 2026-04-16 | Eliminó tablas sin uso |
| 003 | `fix_member_roles_constraints.sql` | 2026-04-16 | Intento de corregir UNIQUE (falló) |
| 004 | `add_static_role_labels.sql` | 2026-04-16 | Eliminó roles obsoletos |
| 005 | `add_audience_types.sql` | 2026-04-16 | Nuevos `audience_type` + `audience_config` |
| 006 | `change_member_status.sql` | 2026-04-16 | `status` → `record_status` |
| 007 | `fix_unique_constraints.sql` | 2026-04-16 | Intento de corregir UNIQUE (falló) |
| 008 | `fix_unique_constraints_v2.sql` | 2026-04-16 | Intento con DO blocks (falló) |
| 009 | `recreate_member_roles_tithes.sql` | 2026-04-16 | ✅ DROP + CREATE corrigió constraints |

---

## ✅ Estado Actual de la Base de Datos

La base de datos está **correcta y lista para desarrollo**.

### Verificación de Constraints (2026-04-16)

**member_roles:**
```
| conname                  | contype | 
|--------------------------|---------|
| member_roles_pkey        | p       | PRIMARY KEY
| uq_member_role           | u       | UNIQUE (member_id, role_type_id)
| fk_member_role_member    | f       | FOREIGN KEY
| fk_member_role_role_type | f       | FOREIGN KEY
```

**tithes:**
```
| conname                   | contype |
|---------------------------|---------|
| tithes_pkey               | p       | PRIMARY KEY
| uq_tithe_member_year_month| u       | UNIQUE (member_id, year, month)
| fk_tithe_member           | f       | FOREIGN KEY
```

---

## 📋 Trabajo Pendiente (Código, no BD)

- **RolesModule**: CRUD para gestionar etiquetas eclesiásticas
- **Backend**: Actualizar queries para usar `record_status`
- **Frontend**: Adaptar filtros al nuevo modelo

---

## Cómo Ejecutar Nuevas Migraciones

### Opción A: Consola Web de Neon
1. Ve a https://console.neon.tech
2. Selecciona tu proyecto → Database → SQL Editor
3. Copia el contenido del script desde `pending/`
4. Click en "Run"
5. Mueve el script a `executed/`

### Opción B: psql desde terminal
```bash
psql "postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require" \
  -f migrations/pending/XXX_nombre_migracion.sql

# Después de ejecutar exitosamente:
mv migrations/pending/XXX_nombre_migracion.sql migrations/executed/
```

---

## Convenciones de Nombres

```
NNN_descripcion_corta.sql
```

- `NNN`: Número secuencial de 3 dígitos (001, 002, etc.)
- `descripcion_corta`: Descripción en snake_case

Ejemplos:
- `004_add_notifications_table.sql`
- `005_add_member_profile_fields.sql`

---

## ADRs Relacionados

Las decisiones de arquitectura que motivaron estas migraciones están documentadas en:

- [ADR-001: Modelo de Mentores y Roles](../../docs-grace-hub/decisions/001-modelo-mentores-y-roles.md)
- [ADR-002: Limpieza de Schema](../../docs-grace-hub/decisions/002-limpieza-schema-tablas.md)
- [ADR-003: Sistema Híbrido de Roles](../../docs-grace-hub/decisions/003-sistema-hibrido-roles.md)
- [ADR-004: Clasificación de Miembros y Jerarquías](../../docs-grace-hub/decisions/004-clasificacion-miembros-y-jerarquias.md)
- [ADR-005: Tipos de Audiencia para Reuniones](../../docs-grace-hub/decisions/005-tipos-audiencia-reuniones.md)
- [ADR-005: Tipos de Audiencia para Reuniones](../../docs-grace-hub/decisions/005-tipos-audiencia-reuniones.md)

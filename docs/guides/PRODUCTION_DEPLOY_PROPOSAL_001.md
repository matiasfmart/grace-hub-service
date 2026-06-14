# Guía de Deploy a Producción — PROPOSAL-001

## Cambios involucrados

| Cambio | Tipo |
|---|---|
| `visit_date DATE` → `visit_at TIMESTAMPTZ` en tabla `prospects` | Schema breaking |
| Nueva columna `meeting_series_id INTEGER FK` en tabla `prospects` | Schema additive |
| Nuevo índice `idx_prospects_visit_at` | Schema additive |
| Nuevo índice `idx_prospects_meeting_series` | Schema additive |
| Código actualizado en `grace-hub-service`, `grace-hub`, `grace-hub-welcome` | Code deploy |

> **Impacto si se deploya el backend sin migrar la BD primero:**
> el servicio arranca pero todas las consultas sobre `prospects` fallan con `column "visit_at" does not exist`,
> dejando la sección de visitantes completamente inoperativa.

---

## Plataformas de producción

| Servicio | Plataforma | URL de referencia |
|---|---|---|
| Base de datos | Neon (PostgreSQL) | dashboard.neon.tech |
| Backend (`grace-hub-service`) | Render (Web Service) | dashboard.render.com |
| Admin (`grace-hub`) | Firebase App Hosting / Render | — |
| PWA (`grace-hub-welcome`) | Render / Vercel | — |

---

## Orden obligatorio de ejecución

```
1. Migración SQL en Neon
2. Deploy de grace-hub-service
3. Deploy de grace-hub  
4. Deploy de grace-hub-welcome
```

No se puede invertir el orden. Los pasos 2–4 son independientes entre sí
una vez completado el paso 1.

---

## PASO 1 — Migración SQL en Neon

### Cuándo ejecutar
Antes de deployar cualquier código. La BD actual en Neon todavía tiene
`visit_date DATE` y no tiene `meeting_series_id`.

### Cómo conectarse a Neon
Opción A — desde la consola SQL del dashboard de Neon (neon.tech → proyecto
→ SQL Editor).

Opción B — desde terminal local:
```bash
psql "postgresql://neondb_owner:<PASSWORD>@ep-frosty-fog-acr0dklm.sa-east-1.aws.neon.tech/neondb?sslmode=require"
```

### SQL de migración (ejecutar en un único bloque)

```sql
-- ============================================================
-- PROPOSAL-001: visit_date → visit_at + meeting_series_id FK
-- Ejecutar en Neon ANTES del deploy del backend
-- ============================================================

BEGIN;

-- 1. Agregar la nueva columna como nullable (permite que las filas existentes no fallen)
ALTER TABLE prospects ADD COLUMN visit_at TIMESTAMPTZ;

-- 2. Migrar datos existentes: convertir DATE → TIMESTAMPTZ medianoche UTC
--    Los registros históricos quedarán con T00:00:00.000Z (detectable por el frontend
--    como "dato legacy" → muestra solo la fecha, sin hora)
UPDATE prospects
SET visit_at = (visit_date::timestamptz AT TIME ZONE 'UTC');

-- 3. Aplicar NOT NULL ahora que todas las filas tienen valor
ALTER TABLE prospects ALTER COLUMN visit_at SET NOT NULL;

-- 4. Eliminar la columna vieja
ALTER TABLE prospects DROP COLUMN visit_date;

-- 5. Nueva columna FK para meeting_series (opcional por diseño)
ALTER TABLE prospects
  ADD COLUMN meeting_series_id INTEGER
  REFERENCES meeting_series(series_id) ON DELETE SET NULL;

-- 6. Índices
DROP INDEX IF EXISTS idx_prospects_visit_date;
CREATE INDEX idx_prospects_visit_at      ON prospects(visit_at);
CREATE INDEX idx_prospects_meeting_series ON prospects(meeting_series_id);

COMMIT;
```

### Verificación post-migración

```sql
-- Confirmar estructura final de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'prospects'
ORDER BY ordinal_position;
```

Resultado esperado:

| column_name | data_type | is_nullable |
|---|---|---|
| prospect_id | integer | NO |
| first_name | character varying | NO |
| last_name | character varying | NO |
| contact | character varying | YES |
| source | USER-DEFINED | NO |
| added_by | integer | YES |
| notes | text | YES |
| status | USER-DEFINED | NO |
| member_id | integer | YES |
| created_at | timestamp with time zone | NO |
| updated_at | timestamp with time zone | NO |
| **visit_at** | **timestamp with time zone** | **NO** |
| **meeting_series_id** | **integer** | **YES** |

```sql
-- Confirmar índices
SELECT indexname FROM pg_indexes WHERE tablename = 'prospects';
-- Debe incluir: idx_prospects_visit_at, idx_prospects_meeting_series
```

```sql
-- Confirmar que los datos se migraron correctamente
SELECT prospect_id, first_name, visit_at FROM prospects LIMIT 5;
-- visit_at debe tener valores (no NULL), con formato 2025-04-10 00:00:00+00
```

---

## PASO 2 — Deploy de `grace-hub-service` (Render)

### Pre-condición
El PASO 1 debe estar completo y verificado.

### Variables de entorno en Render
No se requieren cambios. El `DATABASE_URL` de producción ya está configurado
en Render apuntando a Neon.

Confirmar que `NODE_ENV=production` está seteado — esto desactiva el
`synchronize: true` de TypeORM (que solo corre en desarrollo), evitando
que TypeORM intente modificar la BD en producción.

### Proceso
1. Hacer push del branch a GitHub (o merge a `main` según el flujo de CI/CD).
2. Render detecta el cambio y ejecuta el build automáticamente:
   ```
   npm install
   npm run build      # nest build → compila TypeScript a dist/
   ```
3. Al iniciar: `node dist/main`
4. Verificar en los logs de Render que aparece:
   ```
   [NestApplication] Nest application successfully started
   ```
   y **no** aparece ningún error de `TypeOrmModule` ni `QueryFailedError`.

### Verificación rápida post-deploy del backend
```bash
curl https://<tu-backend-render>.onrender.com/api/v1/health
# o cualquier endpoint público que retorne 200
```

```bash
# Verificar que el endpoint de prospects responde (requiere token admin)
curl -H "Cookie: access_token=<TOKEN>" \
  https://<tu-backend-render>.onrender.com/api/v1/prospects?status=pending
# Debe retornar JSON con visitDate como ISO 8601 datetime, no solo YYYY-MM-DD
```

---

## PASO 3 — Deploy de `grace-hub` (admin)

### Pre-condición
El PASO 2 debe estar completo.

### Variables de entorno
Confirmar que `NEXT_PUBLIC_API_URL` apunta al backend de producción:
```
NEXT_PUBLIC_API_URL=https://<tu-backend-render>.onrender.com/api/v1
```

### Proceso
Build y deploy normal. No hay cambios de configuración requeridos.

### Verificación
1. Ir a la sección **Visitantes** en el admin.
2. Los visitantes existentes deben mostrar solo la fecha (datos legacy, migrados desde `visit_date`).
3. Al abrir **Registrar visitante**, el campo de fecha debe ser `datetime-local` (fecha + hora).
4. El selector **Reunión** debe aparecer y cargar las series disponibles.

---

## PASO 4 — Deploy de `grace-hub-welcome` (PWA)

### Pre-condición
El PASO 2 debe estar completo. El PASO 3 es independiente.

### Variables de entorno
Confirmar que `NEXT_PUBLIC_API_URL` apunta al backend de producción:
```
NEXT_PUBLIC_API_URL=https://<tu-backend-render>.onrender.com/api/v1
```

### Proceso
Build y deploy normal.

### Verificación
1. Abrir la PWA en un dispositivo o el navegador.
2. Loguearse con el código de equipo de bienvenida.
3. Registrar un visitante → verificar que el registro es exitoso.
4. Si hay series de reunión configuradas, el selector de Reunión debe aparecer.
5. El `visit_at` enviado al backend debe ser un ISO 8601 completo
   (ej: `2026-06-14T10:30:00.000Z`), no solo `YYYY-MM-DD`.

---

## Rollback de emergencia

Si el deploy del backend falla y la BD ya fue migrada, el rollback del
código **no es suficiente** — el código viejo espera `visit_date` y la BD
ya tiene `visit_at`. En ese caso:

### Opción A — Fix-forward (recomendada)
Corregir el error en el código y re-deployar. No revertir la BD.

### Opción B — Rollback completo de BD (solo si es imprescindible)
```sql
BEGIN;

-- 1. Recrear la columna vieja
ALTER TABLE prospects ADD COLUMN visit_date DATE;

-- 2. Recuperar datos desde visit_at
UPDATE prospects
SET visit_date = (visit_at AT TIME ZONE 'UTC')::date;

-- 3. Aplicar NOT NULL
ALTER TABLE prospects ALTER COLUMN visit_date SET NOT NULL;

-- 4. Eliminar columnas nuevas
ALTER TABLE prospects DROP COLUMN visit_at;
ALTER TABLE prospects DROP COLUMN meeting_series_id;

-- 5. Restaurar índice original
DROP INDEX IF EXISTS idx_prospects_visit_at;
DROP INDEX IF EXISTS idx_prospects_meeting_series;
CREATE INDEX idx_prospects_visit_date ON prospects(visit_date);

COMMIT;
```

> **Advertencia:** el rollback de BD descarta todos los `meeting_series_id`
> asignados a visitantes y convierte los timestamps precisos de vuelta a
> fechas sin hora. Esta información **no se puede recuperar** después.

---

## Checklist de deploy

```
[ ] 1. NEON: SQL de migración ejecutado sin errores
[ ] 2. NEON: Verificado con SELECT que visit_at tiene datos y meeting_series_id existe
[ ] 3. RENDER: Deploy de grace-hub-service completado
[ ] 4. RENDER: Logs del backend muestran "Nest application successfully started" sin errores TypeORM
[ ] 5. RENDER/VERCEL: Deploy de grace-hub completado
[ ] 6. RENDER/VERCEL: Deploy de grace-hub-welcome completado
[ ] 7. Smoke test: registrar un visitante desde la PWA y verificarlo en el admin
[ ] 8. Smoke test: verificar que los visitantes históricos muestran solo fecha (sin hora)
```

-- ============================================================================
-- Migración 006: Cambiar Status de Miembros a Record Status
-- ============================================================================
-- Fecha: 2026-04-16
-- Descripción: Reemplaza el enum 'status' (Active/Inactive/New) por 
--              'record_status' (vigente/eliminado) según el modelo de 
--              3 dimensiones de clasificación
-- ADR Relacionado: ADR-004 Clasificación de Miembros y Jerarquías
-- ============================================================================

-- Paso 1: Crear el nuevo enum
CREATE TYPE members_record_status_enum AS ENUM('vigente', 'eliminado');

-- Paso 2: Agregar la nueva columna
ALTER TABLE members ADD COLUMN record_status members_record_status_enum;

-- Paso 3: Migrar datos existentes
-- Active y New → vigente (son miembros activos en el sistema)
-- Inactive → eliminado (soft delete)
UPDATE members SET record_status = 'vigente' WHERE status IN ('Active', 'New');
UPDATE members SET record_status = 'eliminado' WHERE status = 'Inactive';

-- Paso 4: Establecer NOT NULL y default después de migrar
ALTER TABLE members ALTER COLUMN record_status SET NOT NULL;
ALTER TABLE members ALTER COLUMN record_status SET DEFAULT 'vigente';

-- Paso 5: Crear índice para el nuevo campo
DROP INDEX IF EXISTS idx_members_status;
CREATE INDEX idx_members_record_status ON members (record_status);

-- Paso 6: Eliminar columna y enum antiguos
ALTER TABLE members DROP COLUMN status;
DROP TYPE members_status_enum;

-- ============================================================================
-- Modelo de 3 Dimensiones (referencia ADR-004):
-- ============================================================================
-- 
-- 1. record_status (PERSISTIDO):
--    - 'vigente': Registro activo en el sistema
--    - 'eliminado': Soft delete, no aparece en consultas normales
--
-- 2. Nivel Operativo (CALCULADO en runtime):
--    - 0: No integrado (sin membresía GDI ni Área)
--    - 1: Miembro (tiene membresía GDI o Área)
--    - 2: Obrero (es miembro de Área, o guía, o mentor)
--    - 3: Líder (es guía de GDI, o líder de Área, o mentor con GDI)
--    - 4: Mentor (tiene asignaciones como mentor)
--
-- 3. Jerarquía Eclesiástica (ETIQUETAS en member_roles):
--    - Pastor, Anciano, Diácono, etc.
--    - Independiente del nivel operativo
--
-- ============================================================================

-- ============================================================================
-- Queries de ejemplo para calcular nivel operativo:
-- ============================================================================
--
-- Ver nivel de un miembro específico:
-- SELECT m.member_id, m.first_name,
--   CASE 
--     WHEN EXISTS (SELECT 1 FROM gdis WHERE mentor_id = m.member_id)
--          OR EXISTS (SELECT 1 FROM areas WHERE mentor_id = m.member_id) THEN 4
--     WHEN EXISTS (SELECT 1 FROM gdis WHERE guide_id = m.member_id)
--          OR EXISTS (SELECT 1 FROM areas WHERE leader_id = m.member_id) THEN 3
--     WHEN EXISTS (SELECT 1 FROM area_memberships WHERE member_id = m.member_id)
--          OR EXISTS (SELECT 1 FROM gdis WHERE guide_id = m.member_id) THEN 2
--     WHEN EXISTS (SELECT 1 FROM gdi_memberships WHERE member_id = m.member_id)
--          OR EXISTS (SELECT 1 FROM area_memberships WHERE member_id = m.member_id) THEN 1
--     ELSE 0
--   END as operative_level
-- FROM members m
-- WHERE m.member_id = ?;
--
-- ============================================================================

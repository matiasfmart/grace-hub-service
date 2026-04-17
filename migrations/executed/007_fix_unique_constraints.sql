-- ============================================================================
-- Migración 007: Corregir Constraints UNIQUE Incorrectos
-- ============================================================================
-- Fecha: 2026-04-16
-- Descripción: Elimina constraints UNIQUE individuales que impiden el 
--              funcionamiento correcto de member_roles y tithes.
--              También elimina campo huérfano meeting_type_id.
-- ============================================================================

-- ============================================================================
-- PROBLEMA 1: member_roles
-- ============================================================================
-- Situación: Hay UNIQUE en member_id y role_type_id individuales
-- Efecto: Un miembro solo puede tener UNA etiqueta, y cada etiqueta solo
--         puede asignarse a UN miembro.
-- Solución: Eliminar los UNIQUE individuales, mantener solo el compuesto.

-- Identificar y eliminar constraints UNIQUE individuales en member_roles
DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Buscar constraint UNIQUE en member_id (excluyendo el compuesto)
    FOR constraint_name IN 
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'member_roles'
        AND c.contype = 'u'
        AND c.conname != 'uq_member_role'
    LOOP
        EXECUTE 'ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Alternativa directa si los nombres son conocidos:
ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS member_roles_member_id_key;
ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS member_roles_role_type_id_key;
ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS member_roles_member_id_key1;
ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS member_roles_role_type_id_key1;

-- ============================================================================
-- PROBLEMA 2: tithes
-- ============================================================================
-- Situación: Hay UNIQUE en year, month, y member_id individuales
-- Efecto: Solo puede existir UN diezmo por año, UN diezmo por mes, y cada
--         miembro solo puede tener UN registro de diezmo total.
-- Solución: Eliminar los UNIQUE individuales, mantener solo el compuesto.

DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    -- Buscar constraints UNIQUE individuales (excluyendo el compuesto y PK)
    FOR constraint_name IN 
        SELECT c.conname
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'tithes'
        AND c.contype = 'u'
        AND c.conname NOT IN ('UQ_87ddb9f4e9bd94cc6045d8cb23d', 'PK_18553b71014c1ca9036c638204e')
    LOOP
        EXECUTE 'ALTER TABLE tithes DROP CONSTRAINT IF EXISTS ' || constraint_name;
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    END LOOP;
END $$;

-- Alternativa directa:
ALTER TABLE tithes DROP CONSTRAINT IF EXISTS tithes_year_key;
ALTER TABLE tithes DROP CONSTRAINT IF EXISTS tithes_month_key;
ALTER TABLE tithes DROP CONSTRAINT IF EXISTS tithes_member_id_key;
ALTER TABLE tithes DROP CONSTRAINT IF EXISTS tithes_year_key1;
ALTER TABLE tithes DROP CONSTRAINT IF EXISTS tithes_month_key1;
ALTER TABLE tithes DROP CONSTRAINT IF EXISTS tithes_member_id_key1;

-- ============================================================================
-- PROBLEMA 3: Campo huérfano meeting_type_id
-- ============================================================================
-- La tabla meeting_types fue eliminada en migración 002, pero el campo
-- meeting_type_id sigue existiendo en meeting_series.

ALTER TABLE meeting_series DROP COLUMN IF EXISTS meeting_type_id;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- Ejecutar después de la migración:
--
-- -- Verificar member_roles (solo debe tener uq_member_role)
-- SELECT conname, contype FROM pg_constraint 
-- WHERE conrelid = 'member_roles'::regclass AND contype = 'u';
--
-- -- Verificar tithes (solo debe tener UQ_87ddb9f4e9bd94cc6045d8cb23d)
-- SELECT conname, contype FROM pg_constraint 
-- WHERE conrelid = 'tithes'::regclass AND contype = 'u';
--
-- -- Verificar que meeting_type_id ya no existe
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'meeting_series' AND column_name = 'meeting_type_id';
-- ============================================================================

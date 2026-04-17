-- ============================================
-- MIGRACIÓN: Corrección de Constraints
-- Fecha: 2026-04-16
-- Descripción: Elimina UNIQUE individuales incorrectos de member_roles y tithes
-- ============================================

-- ============================================
-- PASO 1: Corregir member_roles
-- ============================================

-- El problema: member_id y role_type_id tienen UNIQUE individual,
-- lo que impide que un miembro tenga múltiples roles.

-- Eliminar constraints UNIQUE individuales de member_roles
ALTER TABLE "member_roles" DROP CONSTRAINT IF EXISTS "member_roles_member_id_key";
ALTER TABLE "member_roles" DROP CONSTRAINT IF EXISTS "member_roles_role_type_id_key";

-- Verificar que queda solo el constraint compuesto correcto
-- SELECT conname FROM pg_constraint WHERE conrelid = 'member_roles'::regclass;

-- ============================================
-- PASO 2: Corregir tithes
-- ============================================

-- El problema: year, month, y member_id tienen UNIQUE individual,
-- lo que impide registrar múltiples diezmos.

-- Eliminar constraints UNIQUE individuales de tithes
ALTER TABLE "tithes" DROP CONSTRAINT IF EXISTS "tithes_year_key";
ALTER TABLE "tithes" DROP CONSTRAINT IF EXISTS "tithes_month_key";
ALTER TABLE "tithes" DROP CONSTRAINT IF EXISTS "tithes_member_id_key";

-- También pueden tener otros nombres si fueron creados manualmente
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Buscar y eliminar cualquier constraint UNIQUE individual
    FOR r IN 
        SELECT conname FROM pg_constraint 
        WHERE conrelid = 'tithes'::regclass 
        AND contype = 'u'
        AND cardinality(conkey) = 1  -- Solo constraints de una columna
        AND conname NOT LIKE '%member_year_month%'  -- Excepto el compuesto
    LOOP
        EXECUTE 'ALTER TABLE tithes DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
        RAISE NOTICE 'Eliminado constraint: %', r.conname;
    END LOOP;
END $$;

-- ============================================
-- PASO 3: Verificación
-- ============================================

-- Mostrar constraints restantes de member_roles
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint WHERE conrelid = 'member_roles'::regclass;

-- Mostrar constraints restantes de tithes
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint WHERE conrelid = 'tithes'::regclass;

-- ============================================
-- FIN
-- ============================================

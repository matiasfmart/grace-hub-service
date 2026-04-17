-- ============================================================================
-- Migración 008: FIX - Eliminar UNIQUE Individuales (Segunda Pasada)
-- ============================================================================
-- Fecha: 2026-04-16
-- Descripción: La migración 007 no eliminó correctamente los constraints.
--              Esta migración usa un enfoque más agresivo.
-- ============================================================================

-- PASO 1: Listar constraints actuales (ejecutar primero para verificar)
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'member_roles'::regclass;

-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'tithes'::regclass;

-- ============================================================================
-- MEMBER_ROLES: Eliminar UNIQUE individuales
-- ============================================================================
-- El problema: member_id UNIQUE y role_type_id UNIQUE individuales
-- Solución: Recrear la tabla sin esos constraints

-- Opción A: Si conoces los nombres exactos, descomenta y ejecuta:
-- ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS "member_roles_member_id_key";
-- ALTER TABLE member_roles DROP CONSTRAINT IF EXISTS "member_roles_role_type_id_key";

-- Opción B: Recrear la tabla (más seguro si no hay datos importantes)
DO $$
BEGIN
    -- Verificar si hay datos
    IF (SELECT COUNT(*) FROM member_roles) = 0 THEN
        -- Si está vacía, recrear
        DROP TABLE IF EXISTS member_roles;
        
        CREATE TABLE member_roles (
            member_role_id SERIAL PRIMARY KEY,
            member_id INTEGER NOT NULL,
            role_type_id INTEGER NOT NULL,
            assigned_at TIMESTAMP DEFAULT now() NOT NULL,
            assigned_by INTEGER,
            CONSTRAINT uq_member_role UNIQUE(member_id, role_type_id),
            CONSTRAINT fk_member_role_member FOREIGN KEY (member_id) 
                REFERENCES members(member_id) ON DELETE CASCADE,
            CONSTRAINT fk_member_role_role_type FOREIGN KEY (role_type_id) 
                REFERENCES role_types(role_type_id) ON DELETE CASCADE
        );
        
        CREATE INDEX idx_member_roles_member ON member_roles(member_id);
        CREATE INDEX idx_member_roles_role_type ON member_roles(role_type_id);
        
        RAISE NOTICE 'member_roles recreada correctamente';
    ELSE
        RAISE NOTICE 'member_roles tiene datos, usar ALTER TABLE manualmente';
    END IF;
END $$;

-- ============================================================================
-- TITHES: Eliminar UNIQUE individuales
-- ============================================================================
-- El problema: year UNIQUE, month UNIQUE, member_id UNIQUE individuales
-- Solución: Recrear la tabla sin esos constraints

DO $$
BEGIN
    -- Verificar si hay datos
    IF (SELECT COUNT(*) FROM tithes) = 0 THEN
        -- Si está vacía, recrear
        DROP TABLE IF EXISTS tithes;
        
        CREATE TABLE tithes (
            tithe_id SERIAL PRIMARY KEY,
            member_id INTEGER NOT NULL,
            year INTEGER NOT NULL,
            month INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT now() NOT NULL,
            updated_at TIMESTAMP DEFAULT now() NOT NULL,
            CONSTRAINT uq_tithe_member_year_month UNIQUE(member_id, year, month),
            CONSTRAINT fk_tithe_member FOREIGN KEY (member_id) 
                REFERENCES members(member_id) ON DELETE CASCADE
        );
        
        CREATE INDEX idx_tithes_member ON tithes(member_id);
        CREATE INDEX idx_tithes_year_month ON tithes(year, month);
        
        RAISE NOTICE 'tithes recreada correctamente';
    ELSE
        RAISE NOTICE 'tithes tiene datos, usar ALTER TABLE manualmente';
    END IF;
END $$;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================
-- Ejecutar después:
--
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'member_roles'::regclass;
-- -- Debe mostrar SOLO: uq_member_role, fk_member_role_member, fk_member_role_role_type
--
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'tithes'::regclass;
-- -- Debe mostrar SOLO: uq_tithe_member_year_month, fk_tithe_member
-- ============================================================================

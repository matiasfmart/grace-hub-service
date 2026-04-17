-- ============================================
-- MIGRACIÓN: Corrección de Schema GraceHub
-- Fecha: 2026-04-16
-- Descripción: Agrega tablas de roles, corrige constraints de tithes,
--              y limpia tablas sin uso
-- ============================================

-- ============================================
-- PASO 1: Crear tablas de roles (si no existen)
-- ============================================

-- Tabla de tipos de roles
CREATE TABLE IF NOT EXISTS "role_types" (
  "role_type_id" serial PRIMARY KEY,
  "name" varchar(50) NOT NULL UNIQUE,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Insertar roles base (solo si no existen)
INSERT INTO "role_types" ("name", "description") VALUES
  ('Leader', 'Líder de grupo (GDI o Área)'),
  ('Worker', 'Obrero activo en la iglesia'),
  ('GeneralAttendee', 'Asistente general sin rol de trabajo'),
  ('Mentor', 'Supervisor de GDIs y/o Áreas Ministeriales')
ON CONFLICT (name) DO NOTHING;

-- Tabla de asignación de roles a miembros
CREATE TABLE IF NOT EXISTS "member_roles" (
  "member_role_id" serial PRIMARY KEY,
  "member_id" integer NOT NULL,
  "role_type_id" integer NOT NULL,
  "assigned_at" timestamp DEFAULT now() NOT NULL,
  "assigned_by" integer, -- Opcional: quién asignó el rol
  CONSTRAINT "fk_member_role_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "fk_member_role_role_type" FOREIGN KEY ("role_type_id")
    REFERENCES "role_types"("role_type_id") ON DELETE CASCADE,
  CONSTRAINT "uq_member_role" UNIQUE("member_id", "role_type_id")
);

-- Índices para member_roles
CREATE INDEX IF NOT EXISTS "idx_member_roles_member" ON "member_roles"("member_id");
CREATE INDEX IF NOT EXISTS "idx_member_roles_role_type" ON "member_roles"("role_type_id");

-- ============================================
-- PASO 2: Corregir constraints de tithes
-- ============================================

-- Primero eliminar los constraints incorrectos (UNIQUE individuales)
-- Nota: Estos pueden fallar si los constraints no existen exactamente con estos nombres
-- En ese caso, ignorar el error y continuar

DO $$
BEGIN
  -- Intentar eliminar constraint de year si existe
  BEGIN
    ALTER TABLE "tithes" DROP CONSTRAINT IF EXISTS "tithes_year_key";
  EXCEPTION WHEN undefined_object THEN
    -- Ignorar si no existe
  END;
  
  -- Intentar eliminar constraint de month si existe
  BEGIN
    ALTER TABLE "tithes" DROP CONSTRAINT IF EXISTS "tithes_month_key";
  EXCEPTION WHEN undefined_object THEN
    -- Ignorar si no existe
  END;
  
  -- Intentar eliminar constraint de member_id individual si existe
  BEGIN
    ALTER TABLE "tithes" DROP CONSTRAINT IF EXISTS "tithes_member_id_key";
  EXCEPTION WHEN undefined_object THEN
    -- Ignorar si no existe
  END;
END $$;

-- Asegurarse de que existe el constraint compuesto correcto
-- (si ya existe, no hace nada gracias a IF NOT EXISTS en el índice)
CREATE UNIQUE INDEX IF NOT EXISTS "idx_tithes_member_year_month" 
ON "tithes" ("member_id", "year", "month");

-- ============================================
-- PASO 3: Agregar Foreign Keys faltantes
-- ============================================

-- GDI Memberships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_gdi_membership_gdi'
  ) THEN
    ALTER TABLE "gdi_memberships" 
    ADD CONSTRAINT "fk_gdi_membership_gdi" 
    FOREIGN KEY ("gdi_id") REFERENCES "gdis"("gdi_id") ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_gdi_membership_member'
  ) THEN
    ALTER TABLE "gdi_memberships" 
    ADD CONSTRAINT "fk_gdi_membership_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;
  END IF;
END $$;

-- Area Memberships
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_area_membership_area'
  ) THEN
    ALTER TABLE "area_memberships" 
    ADD CONSTRAINT "fk_area_membership_area" 
    FOREIGN KEY ("area_id") REFERENCES "areas"("area_id") ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_area_membership_member'
  ) THEN
    ALTER TABLE "area_memberships" 
    ADD CONSTRAINT "fk_area_membership_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;
  END IF;
END $$;

-- GDIs (guide y mentor)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_gdi_guide'
  ) THEN
    ALTER TABLE "gdis" 
    ADD CONSTRAINT "fk_gdi_guide" 
    FOREIGN KEY ("guide_id") REFERENCES "members"("member_id") ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_gdi_mentor'
  ) THEN
    ALTER TABLE "gdis" 
    ADD CONSTRAINT "fk_gdi_mentor" 
    FOREIGN KEY ("mentor_id") REFERENCES "members"("member_id") ON DELETE SET NULL;
  END IF;
END $$;

-- Areas (leader y mentor)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_area_leader'
  ) THEN
    ALTER TABLE "areas" 
    ADD CONSTRAINT "fk_area_leader" 
    FOREIGN KEY ("leader_id") REFERENCES "members"("member_id") ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_area_mentor'
  ) THEN
    ALTER TABLE "areas" 
    ADD CONSTRAINT "fk_area_mentor" 
    FOREIGN KEY ("mentor_id") REFERENCES "members"("member_id") ON DELETE SET NULL;
  END IF;
END $$;

-- Meetings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_meeting_series'
  ) THEN
    ALTER TABLE "meetings" 
    ADD CONSTRAINT "fk_meeting_series" 
    FOREIGN KEY ("series_id") REFERENCES "meeting_series"("series_id") ON DELETE CASCADE;
  END IF;
END $$;

-- Attendance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_attendance_meeting'
  ) THEN
    ALTER TABLE "attendance" 
    ADD CONSTRAINT "fk_attendance_meeting" 
    FOREIGN KEY ("meeting_id") REFERENCES "meetings"("meeting_id") ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_attendance_member'
  ) THEN
    ALTER TABLE "attendance" 
    ADD CONSTRAINT "fk_attendance_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;
  END IF;
END $$;

-- Tithes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_tithe_member'
  ) THEN
    ALTER TABLE "tithes" 
    ADD CONSTRAINT "fk_tithe_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================
-- PASO 4: Índices útiles adicionales
-- ============================================

CREATE INDEX IF NOT EXISTS "idx_members_status" ON "members"("status");
CREATE INDEX IF NOT EXISTS "idx_gdi_memberships_gdi" ON "gdi_memberships"("gdi_id");
CREATE INDEX IF NOT EXISTS "idx_gdi_memberships_member" ON "gdi_memberships"("member_id");
CREATE INDEX IF NOT EXISTS "idx_area_memberships_area" ON "area_memberships"("area_id");
CREATE INDEX IF NOT EXISTS "idx_area_memberships_member" ON "area_memberships"("member_id");
CREATE INDEX IF NOT EXISTS "idx_attendance_meeting" ON "attendance"("meeting_id");
CREATE INDEX IF NOT EXISTS "idx_attendance_member" ON "attendance"("member_id");

-- ============================================
-- PASO 5: Verificación (opcional, ejecutar manualmente)
-- ============================================

-- Verificar que las tablas de roles existen
-- SELECT * FROM role_types;

-- Verificar que no hay duplicados en tithes
-- SELECT member_id, year, month, COUNT(*) 
-- FROM tithes 
-- GROUP BY member_id, year, month 
-- HAVING COUNT(*) > 1;

-- ============================================
-- FIN DE LA MIGRACIÓN
-- ============================================

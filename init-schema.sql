-- ============================================
-- 1. MEMBERS (Miembros)
-- ============================================
CREATE TABLE "members" (
  "member_id" serial PRIMARY KEY,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "contact" text,
  "status" text, -- 'Active', 'Inactive', 'New'
  "birth_date" date,
  "baptism_date" date,
  "join_date" date,
  "address" text,
  "bible_study" text,
  "type_bible_study" text
);

-- ============================================
-- 2. ROLE_TYPES (Tipos de Roles)
-- ============================================
CREATE TABLE "role_types" (
  "role_type_id" serial PRIMARY KEY,
  "name" text NOT NULL UNIQUE
);

-- Insertar roles base
INSERT INTO "role_types" ("name") VALUES
  ('Leader'),
  ('Worker'),
  ('GeneralAttendee');

-- ============================================
-- 3. MEMBER_ROLES (Roles de Miembros)
-- ============================================
CREATE TABLE "member_roles" (
  "member_role_id" serial PRIMARY KEY,
  "member_id" integer NOT NULL,
  "role_type_id" integer NOT NULL,
  CONSTRAINT "fk_member_role_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "fk_member_role_role_type" FOREIGN KEY ("role_type_id")
    REFERENCES "role_types"("role_type_id") ON DELETE CASCADE,
  CONSTRAINT "uq_member_role" UNIQUE("member_id", "role_type_id")
);

-- ============================================
-- 4. GDIS (Grupos de Integración Discipular)
-- ============================================
CREATE TABLE "gdis" (
  "gdi_id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "guide_id" integer,
  "mentor_id" integer,
  CONSTRAINT "fk_gdi_guide" FOREIGN KEY ("guide_id")
    REFERENCES "members"("member_id") ON DELETE SET NULL,
  CONSTRAINT "fk_gdi_mentor" FOREIGN KEY ("mentor_id")
    REFERENCES "members"("member_id") ON DELETE SET NULL
);

-- ============================================
-- 5. GDI_MEMBERSHIPS (Relación GDI-Miembros)
-- ============================================
CREATE TABLE "gdi_memberships" (
  "gdi_membership_id" serial PRIMARY KEY,
  "gdi_id" integer NOT NULL,
  "member_id" integer NOT NULL,
  CONSTRAINT "fk_gdi_membership_gdi" FOREIGN KEY ("gdi_id")
    REFERENCES "gdis"("gdi_id") ON DELETE CASCADE,
  CONSTRAINT "fk_gdi_membership_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "uq_gdi_membership" UNIQUE("gdi_id", "member_id")
);

-- ============================================
-- 6. AREAS (Áreas de Ministerio)
-- ============================================
CREATE TABLE "areas" (
  "area_id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "leader_id" integer,
  "mentor_id" integer,
  CONSTRAINT "fk_area_leader" FOREIGN KEY ("leader_id")
    REFERENCES "members"("member_id") ON DELETE SET NULL,
  CONSTRAINT "fk_area_mentor" FOREIGN KEY ("mentor_id")
    REFERENCES "members"("member_id") ON DELETE SET NULL
);

-- ============================================
-- 7. AREA_MEMBERSHIPS (Relación Área-Miembros)
-- ============================================
CREATE TABLE "area_memberships" (
  "area_membership_id" serial PRIMARY KEY,
  "area_id" integer NOT NULL,
  "member_id" integer NOT NULL,
  CONSTRAINT "fk_area_membership_area" FOREIGN KEY ("area_id")
    REFERENCES "areas"("area_id") ON DELETE CASCADE,
  CONSTRAINT "fk_area_membership_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "uq_area_membership" UNIQUE("area_id", "member_id")
);

-- ============================================
-- 8. MEETING_TYPES (Tipos de Reuniones)
-- ============================================
CREATE TABLE "meeting_types" (
  "meeting_type_id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "description" text
);

-- ============================================
-- 9. MEETING_TYPE_ROLES (Roles por Tipo de Reunión)
-- ============================================
CREATE TABLE "meeting_type_roles" (
  "meeting_type_role_id" serial PRIMARY KEY,
  "meeting_type_id" integer NOT NULL,
  "role_type_id" integer NOT NULL,
  CONSTRAINT "fk_mtr_meeting_type" FOREIGN KEY ("meeting_type_id")
    REFERENCES "meeting_types"("meeting_type_id") ON DELETE CASCADE,
  CONSTRAINT "fk_mtr_role_type" FOREIGN KEY ("role_type_id")
    REFERENCES "role_types"("role_type_id") ON DELETE CASCADE,
  CONSTRAINT "uq_meeting_type_role" UNIQUE("meeting_type_id", "role_type_id")
);

-- ============================================
-- 10. MEETING_SERIES (Series de Reuniones)
-- ============================================
CREATE TABLE "meeting_series" (
  "series_id" serial PRIMARY KEY,
  "series_name" text NOT NULL,
  "description" text,
  "frequency" text NOT NULL, -- 'OneTime', 'Weekly', 'Monthly'
  "is_general" boolean NOT NULL,
  "meeting_type_id" integer,
  "gdi_id" integer,
  "area_id" integer,

  -- Configuración base
  "default_time" text,
  "default_location" text,
  "target_attendee_groups" text[], -- ['leaders', 'workers', 'allMembers']

  -- Recurrencia semanal
  "weekly_days" text[], -- ['Monday', 'Wednesday', 'Friday']

  -- Recurrencia mensual
  "monthly_rule_type" text, -- 'DayOfMonth' | 'DayOfWeekOfMonth'
  "monthly_day_of_month" integer, -- 1-31
  "monthly_week_ordinal" text, -- 'First', 'Second', 'Third', 'Fourth', 'Last'
  "monthly_day_of_week" text, -- 'Monday', 'Tuesday', etc.

  -- Fechas especiales
  "cancelled_dates" date[],

  CONSTRAINT "fk_ms_meeting_type" FOREIGN KEY ("meeting_type_id")
    REFERENCES "meeting_types"("meeting_type_id") ON DELETE SET NULL,
  CONSTRAINT "fk_ms_gdi" FOREIGN KEY ("gdi_id")
    REFERENCES "gdis"("gdi_id") ON DELETE CASCADE,
  CONSTRAINT "fk_ms_area" FOREIGN KEY ("area_id")
    REFERENCES "areas"("area_id") ON DELETE CASCADE
);

-- ============================================
-- 11. MEETINGS (Instancias de Reuniones)
-- ============================================
CREATE TABLE "meetings" (
  "meeting_id" serial PRIMARY KEY,
  "series_id" integer,
  "name" text NOT NULL,
  "description" text,
  "date" date NOT NULL,
  "time" text NOT NULL,
  "location" text NOT NULL,
  "is_manual" boolean DEFAULT false NOT NULL,
  "meeting_type_id" integer,
  "gdi_id" integer,
  "area_id" integer,
  "minute" text, -- Notas/actas de la reunión

  CONSTRAINT "fk_meetings_series" FOREIGN KEY ("series_id")
    REFERENCES "meeting_series"("series_id") ON DELETE SET NULL,
  CONSTRAINT "fk_meeting_meeting_type" FOREIGN KEY ("meeting_type_id")
    REFERENCES "meeting_types"("meeting_type_id") ON DELETE SET NULL,
  CONSTRAINT "fk_meeting_gdi" FOREIGN KEY ("gdi_id")
    REFERENCES "gdis"("gdi_id") ON DELETE CASCADE,
  CONSTRAINT "fk_meeting_area" FOREIGN KEY ("area_id")
    REFERENCES "areas"("area_id") ON DELETE CASCADE
);

-- ============================================
-- 12. MEETING_ATTENDEES (Asistentes Esperados)
-- ============================================
CREATE TABLE "meeting_attendees" (
  "meeting_attendee_id" serial PRIMARY KEY,
  "meeting_id" integer NOT NULL,
  "member_id" integer NOT NULL,
  CONSTRAINT "fk_ma_meeting" FOREIGN KEY ("meeting_id")
    REFERENCES "meetings"("meeting_id") ON DELETE CASCADE,
  CONSTRAINT "fk_ma_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "uq_meeting_attendee" UNIQUE("meeting_id", "member_id")
);

-- ============================================
-- 13. ATTENDANCE (Registros de Asistencia)
-- ============================================
CREATE TABLE "attendance" (
  "attendance_id" serial PRIMARY KEY,
  "meeting_id" integer NOT NULL,
  "member_id" integer NOT NULL,
  "was_present" boolean NOT NULL,
  "was_active" boolean NOT NULL,

  -- Snapshots para auditoría histórica
  "snapshot_role_general" text NOT NULL,
  "snapshot_role_specific" text,
  "snapshot_gdi_id" integer,
  "snapshot_area_id" integer,

  CONSTRAINT "fk_attendance_meeting" FOREIGN KEY ("meeting_id")
    REFERENCES "meetings"("meeting_id") ON DELETE CASCADE,
  CONSTRAINT "fk_attendance_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "fk_attendance_snapshot_gdi" FOREIGN KEY ("snapshot_gdi_id")
    REFERENCES "gdis"("gdi_id") ON DELETE SET NULL,
  CONSTRAINT "fk_attendance_snapshot_area" FOREIGN KEY ("snapshot_area_id")
    REFERENCES "areas"("area_id") ON DELETE SET NULL
);

-- ============================================
-- 14. TITHES (Diezmos)
-- ============================================
CREATE TABLE "tithes" (
  "tithe_id" serial PRIMARY KEY,
  "member_id" integer NOT NULL,
  "year" integer NOT NULL,
  "month" integer NOT NULL,
  CONSTRAINT "fk_tithe_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE,
  CONSTRAINT "uq_tithe" UNIQUE("member_id", "year", "month"),
  CONSTRAINT "chk_month" CHECK ("month" >= 1 AND "month" <= 12)
);

-- ============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ============================================

-- GDI Memberships
CREATE INDEX "idx_gdi_memberships_gdi" ON "gdi_memberships"("gdi_id");
CREATE INDEX "idx_gdi_memberships_member" ON "gdi_memberships"("member_id");

-- Area Memberships
CREATE INDEX "idx_area_memberships_area" ON "area_memberships"("area_id");
CREATE INDEX "idx_area_memberships_member" ON "area_memberships"("member_id");

-- Meetings
CREATE INDEX "idx_meetings_date" ON "meetings"("date");
CREATE INDEX "idx_meetings_series" ON "meetings"("series_id");
CREATE INDEX "idx_meetings_gdi" ON "meetings"("gdi_id");
CREATE INDEX "idx_meetings_area" ON "meetings"("area_id");

-- Attendance
CREATE INDEX "idx_attendance_meeting" ON "attendance"("meeting_id");
CREATE INDEX "idx_attendance_member" ON "attendance"("member_id");

-- Tithes
CREATE INDEX "idx_tithes_member" ON "tithes"("member_id");
CREATE INDEX "idx_tithes_year_month" ON "tithes"("year", "month");

-- Member Roles
CREATE INDEX "idx_member_roles_member" ON "member_roles"("member_id");
CREATE INDEX "idx_member_roles_role_type" ON "member_roles"("role_type_id");

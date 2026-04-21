-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE "members_record_status_enum" AS ENUM ('vigente', 'eliminado');

CREATE TYPE "meeting_series_audience_type_enum" AS ENUM (
  'gdi', 'area',
  'all_active', 'integrated', 'workers', 'leaders', 'mentors',
  'by_categories'
);

CREATE TYPE "meeting_series_frequency_enum" AS ENUM ('OneTime', 'Weekly', 'Monthly');

CREATE TYPE "meeting_series_monthly_rule_type_enum" AS ENUM ('DayOfMonth', 'DayOfWeekOfMonth');

CREATE TYPE "meeting_series_monthly_week_ordinal_enum" AS ENUM (
  'First', 'Second', 'Third', 'Fourth', 'Last'
);

CREATE TYPE "meeting_series_monthly_day_of_week_enum" AS ENUM (
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
);

-- ============================================
-- 1. MEMBERS (Miembros)
-- ============================================
CREATE TABLE "members" (
  "member_id" serial PRIMARY KEY,
  "first_name" varchar(100) NOT NULL,
  "last_name" varchar(100) NOT NULL,
  "contact" varchar(255),
  "record_status" "members_record_status_enum" NOT NULL DEFAULT 'vigente',
  "birth_date" date,
  "baptism_date" date,
  "join_date" date,
  "bible_study" boolean NOT NULL DEFAULT false,
  "type_bible_study" varchar(100),
  "address" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- 2. ROLE_TYPES (Etiquetas Eclesiásticas)
-- ============================================
CREATE TABLE "role_types" (
  "role_type_id" serial PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "created_at" timestamp with time zone
);

-- ============================================
-- 3. MEMBER_ROLES (Asignación de Etiquetas)
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
  "name" varchar(255) NOT NULL,
  "guide_id" integer,
  "mentor_id" integer,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
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
  "name" varchar(255) NOT NULL,
  "leader_id" integer,
  "mentor_id" integer,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
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
-- 9. MEETING_SERIES (Series de Reuniones)
-- ============================================
CREATE TABLE "meeting_series" (
  "series_id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "description" text,

  -- Audiencia: quiénes deben asistir
  "audience_type" "meeting_series_audience_type_enum" NOT NULL,
  "audience_config" jsonb,            -- solo para audience_type = 'by_categories'
  "gdi_id" integer,                   -- solo para audience_type = 'gdi'
  "area_id" integer,                  -- solo para audience_type = 'area'
  "meeting_type_id" integer,

  -- Recurrencia
  "frequency" "meeting_series_frequency_enum" NOT NULL DEFAULT 'OneTime',
  "start_date" date NOT NULL,
  "end_date" date,
  "default_time" time,
  "default_location" varchar(255),

  -- OneTime
  "one_time_date" date,

  -- Semanal
  "weekly_days" text[],

  -- Mensual
  "monthly_rule_type" "meeting_series_monthly_rule_type_enum",
  "monthly_day_of_month" integer,
  "monthly_week_ordinal" "meeting_series_monthly_week_ordinal_enum",
  "monthly_day_of_week" "meeting_series_monthly_day_of_week_enum",

  -- Fechas canceladas
  "cancelled_dates" date[],

  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT "fk_ms_meeting_type" FOREIGN KEY ("meeting_type_id")
    REFERENCES "meeting_types"("meeting_type_id") ON DELETE SET NULL,
  CONSTRAINT "fk_ms_gdi" FOREIGN KEY ("gdi_id")
    REFERENCES "gdis"("gdi_id") ON DELETE CASCADE,
  CONSTRAINT "fk_ms_area" FOREIGN KEY ("area_id")
    REFERENCES "areas"("area_id") ON DELETE CASCADE
);

-- ============================================
-- 10. MEETINGS (Instancias de Reuniones)
-- ============================================
CREATE TABLE "meetings" (
  "meeting_id" serial PRIMARY KEY,
  "series_id" integer NOT NULL,
  "date" date NOT NULL,
  "time" time,
  "location" varchar(255),
  "notes" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),

  CONSTRAINT "fk_meetings_series" FOREIGN KEY ("series_id")
    REFERENCES "meeting_series"("series_id") ON DELETE CASCADE
);

-- ============================================
-- 11. MEETING_ATTENDEES (Asistentes Esperados)
-- ============================================
CREATE TABLE "meeting_attendees" (
  "meeting_attendee_id" serial PRIMARY KEY,
  "meeting_id" integer NOT NULL,
  "member_id" integer NOT NULL,
  "is_expected" boolean NOT NULL DEFAULT true,
  "category_snapshot" varchar(50),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "fk_ma_meeting" FOREIGN KEY ("meeting_id")
    REFERENCES "meetings"("meeting_id") ON DELETE CASCADE,
  CONSTRAINT "fk_ma_member" FOREIGN KEY ("member_id")
    REFERENCES "members"("member_id") ON DELETE CASCADE
);

-- ============================================
-- 12. ATTENDANCE (Registros de Asistencia)
-- ============================================
CREATE TABLE "attendance" (
  "attendance_id" serial PRIMARY KEY,
  "meeting_id" integer NOT NULL,
  "member_id" integer NOT NULL,
  "was_present" boolean NOT NULL,
  "snapshot_gdi_id" integer,
  "snapshot_area_id" integer,
  "snapshot_category" varchar(50),
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),

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
-- 13. TITHES (Diezmos)
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

-- Meeting Series
CREATE INDEX "idx_meeting_series_gdi" ON "meeting_series"("gdi_id");
CREATE INDEX "idx_meeting_series_area" ON "meeting_series"("area_id");

-- Meetings
CREATE INDEX "idx_meetings_date" ON "meetings"("date");
CREATE INDEX "idx_meetings_series" ON "meetings"("series_id");

-- Meeting Attendees
CREATE INDEX "idx_meeting_attendees_meeting" ON "meeting_attendees"("meeting_id");
CREATE INDEX "idx_meeting_attendees_member" ON "meeting_attendees"("member_id");

-- Attendance
CREATE INDEX "idx_attendance_meeting" ON "attendance"("meeting_id");
CREATE INDEX "idx_attendance_member" ON "attendance"("member_id");

-- Tithes
CREATE INDEX "idx_tithes_member" ON "tithes"("member_id");
CREATE INDEX "idx_tithes_year_month" ON "tithes"("year", "month");

-- Member Roles
CREATE INDEX "idx_member_roles_member" ON "member_roles"("member_id");
CREATE INDEX "idx_member_roles_role_type" ON "member_roles"("role_type_id");

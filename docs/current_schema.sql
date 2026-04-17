-- ============================================
-- Grace Hub - Schema de Base de Datos
-- Última actualización: 2026-04-16
-- Base de datos: PostgreSQL (Neon Cloud)
-- ============================================

CREATE SCHEMA "public";

-- ============================================
-- TIPOS ENUMERADOS
-- ============================================

CREATE TYPE "members_status_enum" AS ENUM('Active', 'Inactive', 'New');
CREATE TYPE "meeting_series_frequency_enum" AS ENUM('OneTime', 'Weekly', 'Monthly');
CREATE TYPE "meeting_series_monthly_rule_type_enum" AS ENUM('DayOfMonth', 'DayOfWeekOfMonth');
CREATE TYPE "meeting_series_monthly_week_ordinal_enum" AS ENUM('First', 'Second', 'Third', 'Fourth', 'Last');
CREATE TYPE "meeting_series_monthly_day_of_week_enum" AS ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
CREATE TYPE "meeting_series_audience_type_enum" AS ENUM('gdi', 'area', 'by_categories', 'all_active');

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Miembros de la iglesia
CREATE TABLE "members" (
	"member_id" serial PRIMARY KEY,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"contact" varchar(255),
	"status" members_status_enum DEFAULT 'New' NOT NULL,
	"birth_date" date,
	"baptism_date" date,
	"join_date" date,
	"bible_study" boolean DEFAULT false NOT NULL,
	"type_bible_study" varchar(100),
	"address" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Grupos de Integración (GDIs)
CREATE TABLE "gdis" (
	"gdi_id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"guide_id" integer,
	"mentor_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Membresías de GDI (integrantes)
CREATE TABLE "gdi_memberships" (
	"gdi_membership_id" serial PRIMARY KEY,
	"gdi_id" integer NOT NULL,
	"member_id" integer NOT NULL
);

-- Áreas Ministeriales
CREATE TABLE "areas" (
	"area_id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"leader_id" integer,
	"mentor_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Membresías de Área (integrantes)
CREATE TABLE "area_memberships" (
	"area_membership_id" serial PRIMARY KEY,
	"area_id" integer NOT NULL,
	"member_id" integer NOT NULL
);

-- Tipos de Rol
CREATE TABLE "role_types" (
	"role_type_id" serial PRIMARY KEY,
	"name" varchar(50) NOT NULL UNIQUE,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Roles asignados a miembros
CREATE TABLE "member_roles" (
	"member_role_id" serial PRIMARY KEY,
	"member_id" integer NOT NULL,
	"role_type_id" integer NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"assigned_by" integer,
	CONSTRAINT "uq_member_role" UNIQUE("member_id", "role_type_id")
);

-- Series de Reuniones (plantillas)
CREATE TABLE "meeting_series" (
	"series_id" serial PRIMARY KEY,
	"name" varchar(255) NOT NULL,
	"description" text,
	"audience_type" meeting_series_audience_type_enum NOT NULL,
	"gdi_id" integer,
	"area_id" integer,
	"meeting_type_id" integer,
	"frequency" meeting_series_frequency_enum DEFAULT 'OneTime' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"one_time_date" date,
	"weekly_days" text[],
	"monthly_rule_type" meeting_series_monthly_rule_type_enum,
	"monthly_day_of_month" integer,
	"monthly_week_ordinal" meeting_series_monthly_week_ordinal_enum,
	"monthly_day_of_week" meeting_series_monthly_day_of_week_enum,
	"default_time" time,
	"default_location" varchar(255),
	"cancelled_dates" date[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Instancias de Reuniones
CREATE TABLE "meetings" (
	"meeting_id" serial PRIMARY KEY,
	"series_id" integer NOT NULL,
	"date" date NOT NULL,
	"time" time,
	"location" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Registros de Asistencia
CREATE TABLE "attendance" (
	"attendance_id" serial PRIMARY KEY,
	"meeting_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"was_present" boolean NOT NULL,
	"snapshot_gdi_id" integer,
	"snapshot_area_id" integer,
	"snapshot_category" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Registro de Diezmos
CREATE TABLE "tithes" (
	"tithe_id" serial PRIMARY KEY,
	"member_id" integer NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_tithes_member_year_month" UNIQUE("member_id", "year", "month")
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX "idx_members_status" ON "members" ("status");
CREATE INDEX "idx_gdi_memberships_gdi" ON "gdi_memberships" ("gdi_id");
CREATE INDEX "idx_gdi_memberships_member" ON "gdi_memberships" ("member_id");
CREATE INDEX "idx_area_memberships_area" ON "area_memberships" ("area_id");
CREATE INDEX "idx_area_memberships_member" ON "area_memberships" ("member_id");
CREATE INDEX "idx_attendance_meeting" ON "attendance" ("meeting_id");
CREATE INDEX "idx_attendance_member" ON "attendance" ("member_id");
CREATE INDEX "idx_member_roles_member" ON "member_roles" ("member_id");
CREATE INDEX "idx_member_roles_role_type" ON "member_roles" ("role_type_id");

-- ============================================
-- FOREIGN KEYS
-- ============================================

-- GDI Memberships
ALTER TABLE "gdi_memberships" ADD CONSTRAINT "fk_gdi_membership_gdi" 
    FOREIGN KEY ("gdi_id") REFERENCES "gdis"("gdi_id") ON DELETE CASCADE;
ALTER TABLE "gdi_memberships" ADD CONSTRAINT "fk_gdi_membership_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;

-- Area Memberships
ALTER TABLE "area_memberships" ADD CONSTRAINT "fk_area_membership_area" 
    FOREIGN KEY ("area_id") REFERENCES "areas"("area_id") ON DELETE CASCADE;
ALTER TABLE "area_memberships" ADD CONSTRAINT "fk_area_membership_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;

-- GDIs
ALTER TABLE "gdis" ADD CONSTRAINT "fk_gdi_guide" 
    FOREIGN KEY ("guide_id") REFERENCES "members"("member_id") ON DELETE SET NULL;
ALTER TABLE "gdis" ADD CONSTRAINT "fk_gdi_mentor" 
    FOREIGN KEY ("mentor_id") REFERENCES "members"("member_id") ON DELETE SET NULL;

-- Areas
ALTER TABLE "areas" ADD CONSTRAINT "fk_area_leader" 
    FOREIGN KEY ("leader_id") REFERENCES "members"("member_id") ON DELETE SET NULL;
ALTER TABLE "areas" ADD CONSTRAINT "fk_area_mentor" 
    FOREIGN KEY ("mentor_id") REFERENCES "members"("member_id") ON DELETE SET NULL;

-- Meetings
ALTER TABLE "meetings" ADD CONSTRAINT "fk_meeting_series" 
    FOREIGN KEY ("series_id") REFERENCES "meeting_series"("series_id") ON DELETE CASCADE;

-- Attendance
ALTER TABLE "attendance" ADD CONSTRAINT "fk_attendance_meeting" 
    FOREIGN KEY ("meeting_id") REFERENCES "meetings"("meeting_id") ON DELETE CASCADE;
ALTER TABLE "attendance" ADD CONSTRAINT "fk_attendance_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;

-- Member Roles
ALTER TABLE "member_roles" ADD CONSTRAINT "fk_member_role_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;
ALTER TABLE "member_roles" ADD CONSTRAINT "fk_member_role_role_type" 
    FOREIGN KEY ("role_type_id") REFERENCES "role_types"("role_type_id") ON DELETE CASCADE;

-- Tithes
ALTER TABLE "tithes" ADD CONSTRAINT "fk_tithe_member" 
    FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE;

-- ============================================
-- DATOS INICIALES (SEEDS)
-- ============================================

INSERT INTO "role_types" ("name", "description") VALUES
    ('Leader', 'Líder de grupo (GDI o Área)'),
    ('Worker', 'Obrero activo en la iglesia'),
    ('GeneralAttendee', 'Asistente general sin rol de trabajo'),
    ('Mentor', 'Supervisor de GDIs y/o Áreas Ministeriales');

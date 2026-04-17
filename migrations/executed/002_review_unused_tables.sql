-- ============================================
-- MIGRACIÓN: Eliminación de tablas sin uso
-- Fecha: 2026-04-16
-- Descripción: Elimina tablas que no se usan en el código actual
-- ============================================

-- IMPORTANTE: Eliminar en orden correcto por dependencias FK

-- 1. Primero: Tablas que dependen de otras
DROP TABLE IF EXISTS "meeting_type_categories" CASCADE;
DROP TABLE IF EXISTS "meeting_attendees" CASCADE;

-- 2. Después: Tablas principales sin uso
DROP TABLE IF EXISTS "attendee_categories" CASCADE;
DROP TABLE IF EXISTS "meeting_types" CASCADE;

-- ============================================
-- FIN
-- ============================================

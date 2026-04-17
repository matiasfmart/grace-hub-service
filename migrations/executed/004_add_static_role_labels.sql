-- ============================================================================
-- Migración 004: Limpiar Roles Obsoletos
-- ============================================================================
-- Fecha: 2026-04-16
-- Descripción: Elimina roles que ahora son calculados dinámicamente y prepara
--              la tabla role_types para etiquetas eclesiásticas configurables
-- ADR Relacionado: ADR-003 Sistema Híbrido de Roles, ADR-004 Clasificación
-- ============================================================================

-- ============================================================================
-- CONTEXTO:
-- ============================================================================
-- Antes: role_types contenía roles "dinámicos" (Leader, Worker, Mentor, 
--        GeneralAttendee) que intentaban clasificar miembros.
-- 
-- Ahora: El nivel operativo (Mentor/Líder/Obrero/Miembro) se CALCULA en runtime
--        basándose en las relaciones del miembro (gdis, areas, memberships).
--        
--        role_types ahora solo almacena ETIQUETAS ECLESIÁSTICAS (Pastor, 
--        Diácono, Anciano, etc.) que son específicas de cada congregación
--        y se gestionan desde la UI de administración.
-- ============================================================================

-- Paso 1: Eliminar asignaciones de roles obsoletos
DELETE FROM member_roles 
WHERE role_type_id IN (
  SELECT role_type_id FROM role_types 
  WHERE name IN ('Leader', 'Worker', 'Mentor', 'GeneralAttendee')
);

-- Paso 2: Eliminar los tipos de rol obsoletos
DELETE FROM role_types 
WHERE name IN ('Leader', 'Worker', 'Mentor', 'GeneralAttendee');

-- ============================================================================
-- NOTA IMPORTANTE:
-- ============================================================================
-- Esta migración NO inserta etiquetas predefinidas.
-- Las etiquetas eclesiásticas (Pastor, Diácono, Anciano, Tesorero, etc.) 
-- deben crearse desde la vista de administración del sistema.
--
-- Cada congregación tiene su propia estructura de roles eclesiásticos.
-- El sistema debe proveer un CRUD para role_types accesible desde:
--   - Frontend: /admin/roles (por implementar)
--   - Backend: RolesModule con endpoints CRUD (por implementar)
-- ============================================================================

-- Verificación
-- SELECT * FROM role_types ORDER BY role_type_id;
-- Resultado esperado: tabla vacía (las etiquetas se agregan desde la UI)

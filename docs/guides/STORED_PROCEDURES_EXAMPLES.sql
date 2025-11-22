-- =====================================================
-- GRACE HUB SERVICE - STORED PROCEDURES EXAMPLES
-- =====================================================
-- Este archivo contiene ejemplos de stored procedures
-- que puedes crear en PostgreSQL/Neon para manejar
-- la lógica compleja del negocio.
-- =====================================================

-- =====================================================
-- 1. TITHES - Batch Upsert
-- =====================================================
-- Inserta o actualiza un diezmo (evita duplicados)
CREATE OR REPLACE FUNCTION sp_upsert_tithe(
  p_member_id INTEGER,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS TABLE(
  tithe_id INTEGER,
  member_id INTEGER,
  year INTEGER,
  month INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO tithes (member_id, year, month, created_at, updated_at)
  VALUES (p_member_id, p_year, p_month, NOW(), NOW())
  ON CONFLICT (member_id, year, month)
  DO UPDATE SET updated_at = NOW()
  RETURNING *;
END;
$$ LANGUAGE plpgsql;

-- Ejemplo de uso desde el repositorio:
-- const result = await this.executeStoredProcedure<Tithe[]>(
--   'sp_upsert_tithe',
--   [memberId, year, month]
-- );


-- =====================================================
-- 2. MEMBERS - Obtener miembro con sus roles calculados
-- =====================================================
CREATE OR REPLACE FUNCTION sp_get_member_with_roles(p_member_id INTEGER)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'member_id', m.member_id,
    'first_name', m.first_name,
    'last_name', m.last_name,
    'contact', m.contact,
    'status', m.status,
    'birth_date', m.birth_date,
    'baptism_date', m.baptism_date,
    'join_date', m.join_date,
    'bible_study', m.bible_study,
    'type_bible_study', m.type_bible_study,
    'roles', (
      SELECT json_agg(
        json_build_object(
          'role_general', mr.role_general,
          'role_specific', mr.role_specific,
          'context_type', mr.context_type,
          'context_id', mr.context_id
        )
      )
      FROM member_roles mr
      WHERE mr.member_id = m.member_id
    )
  ) INTO result
  FROM members m
  WHERE m.member_id = p_member_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 3. ROLES - Calcular y actualizar roles dinámicamente
-- =====================================================
-- Calcula los roles de un miembro basado en sus asignaciones
CREATE OR REPLACE FUNCTION sp_calculate_member_roles(p_member_id INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Eliminar roles antiguos
  DELETE FROM member_roles WHERE member_id = p_member_id;

  -- Insertar rol si es GUIDE de un GDI
  INSERT INTO member_roles (member_id, role_general, role_specific, context_type, context_id)
  SELECT
    p_member_id,
    'Leader'::role_type,
    'GDI Guide',
    'GDI',
    g.gdi_id
  FROM gdis g
  WHERE g.guide_id = p_member_id;

  -- Insertar rol si es MENTOR de un GDI
  INSERT INTO member_roles (member_id, role_general, role_specific, context_type, context_id)
  SELECT
    p_member_id,
    'Leader'::role_type,
    'GDI Mentor',
    'GDI',
    g.gdi_id
  FROM gdis g
  WHERE g.mentor_id = p_member_id;

  -- Insertar rol si es LEADER de un AREA
  INSERT INTO member_roles (member_id, role_general, role_specific, context_type, context_id)
  SELECT
    p_member_id,
    'Leader'::role_type,
    'Area Leader',
    'Area',
    a.area_id
  FROM areas a
  WHERE a.leader_id = p_member_id;

  -- Insertar rol si es MENTOR de un AREA
  INSERT INTO member_roles (member_id, role_general, role_specific, context_type, context_id)
  SELECT
    p_member_id,
    'Leader'::role_type,
    'Area Mentor',
    'Area',
    a.area_id
  FROM areas a
  WHERE a.mentor_id = p_member_id;

  -- Insertar rol si es WORKER de un AREA
  INSERT INTO member_roles (member_id, role_general, role_specific, context_type, context_id)
  SELECT
    p_member_id,
    'Worker'::role_type,
    'Area Worker',
    'Area',
    am.area_id
  FROM area_memberships am
  WHERE am.member_id = p_member_id;

  -- Si no tiene ningún rol, es GeneralAttendee
  INSERT INTO member_roles (member_id, role_general, role_specific, context_type, context_id)
  SELECT p_member_id, 'GeneralAttendee'::role_type, NULL, NULL, NULL
  WHERE NOT EXISTS (
    SELECT 1 FROM member_roles WHERE member_id = p_member_id
  );
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 4. GDIS - Cambiar guía de un GDI (con recálculo de roles)
-- =====================================================
CREATE OR REPLACE FUNCTION sp_change_gdi_guide(
  p_gdi_id INTEGER,
  p_new_guide_id INTEGER
)
RETURNS VOID AS $$
DECLARE
  v_old_guide_id INTEGER;
BEGIN
  -- Obtener el guía anterior
  SELECT guide_id INTO v_old_guide_id FROM gdis WHERE gdi_id = p_gdi_id;

  -- Actualizar el GDI
  UPDATE gdis SET guide_id = p_new_guide_id WHERE gdi_id = p_gdi_id;

  -- Recalcular roles del guía anterior (si existía)
  IF v_old_guide_id IS NOT NULL THEN
    PERFORM sp_calculate_member_roles(v_old_guide_id);
  END IF;

  -- Recalcular roles del nuevo guía
  IF p_new_guide_id IS NOT NULL THEN
    PERFORM sp_calculate_member_roles(p_new_guide_id);
  END IF;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 5. MEMBERS - Eliminar miembro (con cascade manual)
-- =====================================================
CREATE OR REPLACE FUNCTION sp_delete_member(p_member_id INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Eliminar registros dependientes en el orden correcto
  DELETE FROM attendance WHERE member_id = p_member_id;
  DELETE FROM tithes WHERE member_id = p_member_id;
  DELETE FROM member_roles WHERE member_id = p_member_id;
  DELETE FROM area_memberships WHERE member_id = p_member_id;
  DELETE FROM gdi_memberships WHERE member_id = p_member_id;

  -- Quitar referencias de GDIs donde es guide o mentor
  UPDATE gdis SET guide_id = NULL WHERE guide_id = p_member_id;
  UPDATE gdis SET mentor_id = NULL WHERE mentor_id = p_member_id;

  -- Quitar referencias de Areas donde es leader o mentor
  UPDATE areas SET leader_id = NULL WHERE leader_id = p_member_id;
  UPDATE areas SET mentor_id = NULL WHERE mentor_id = p_member_id;

  -- Finalmente eliminar el miembro
  DELETE FROM members WHERE member_id = p_member_id;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 6. ATTENDANCE - Registrar asistencia con snapshots
-- =====================================================
CREATE OR REPLACE FUNCTION sp_upsert_attendance(
  p_meeting_id INTEGER,
  p_member_id INTEGER,
  p_was_present BOOLEAN,
  p_was_active BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
  attendance_id INTEGER,
  meeting_id INTEGER,
  member_id INTEGER,
  was_present BOOLEAN,
  was_active BOOLEAN,
  snapshot_role_general VARCHAR,
  snapshot_role_specific VARCHAR,
  snapshot_gdi_id INTEGER,
  snapshot_area_id INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) AS $$
DECLARE
  v_role_general VARCHAR;
  v_role_specific VARCHAR;
  v_gdi_id INTEGER;
  v_area_id INTEGER;
BEGIN
  -- Obtener snapshot del rol general (el primero)
  SELECT role_general, role_specific
  INTO v_role_general, v_role_specific
  FROM member_roles
  WHERE member_id = p_member_id
  LIMIT 1;

  -- Obtener GDI del miembro
  SELECT gdi_id INTO v_gdi_id
  FROM gdi_memberships
  WHERE member_id = p_member_id
  LIMIT 1;

  -- Obtener Area del miembro (si es worker)
  SELECT area_id INTO v_area_id
  FROM area_memberships
  WHERE member_id = p_member_id
  LIMIT 1;

  -- Upsert de attendance
  RETURN QUERY
  INSERT INTO attendance (
    meeting_id,
    member_id,
    was_present,
    was_active,
    snapshot_role_general,
    snapshot_role_specific,
    snapshot_gdi_id,
    snapshot_area_id,
    created_at,
    updated_at
  ) VALUES (
    p_meeting_id,
    p_member_id,
    p_was_present,
    p_was_active,
    v_role_general,
    v_role_specific,
    v_gdi_id,
    v_area_id,
    NOW(),
    NOW()
  )
  ON CONFLICT (meeting_id, member_id)
  DO UPDATE SET
    was_present = EXCLUDED.was_present,
    was_active = EXCLUDED.was_active,
    updated_at = NOW()
  RETURNING *;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 7. MEETINGS - Resolver asistentes esperados
-- =====================================================
-- Obtiene los miembros que deberían asistir a una reunión
CREATE OR REPLACE FUNCTION sp_resolve_expected_attendees(
  p_series_id INTEGER,
  p_meeting_id INTEGER
)
RETURNS TABLE(member_id INTEGER) AS $$
DECLARE
  v_target_groups TEXT[];
  v_is_general BOOLEAN;
  v_gdi_id INTEGER;
  v_area_id INTEGER;
BEGIN
  -- Obtener configuración de la serie
  SELECT target_attendee_groups, is_general, gdi_id, area_id
  INTO v_target_groups, v_is_general, v_gdi_id, v_area_id
  FROM meeting_series
  WHERE series_id = p_series_id;

  -- Si es reunión general, todos los miembros activos
  IF v_is_general THEN
    RETURN QUERY
    SELECT m.member_id
    FROM members m
    WHERE m.status = 'Active';
    RETURN;
  END IF;

  -- Si es de un GDI, miembros del GDI según roles esperados
  IF v_gdi_id IS NOT NULL THEN
    IF 'allMembers' = ANY(v_target_groups) THEN
      RETURN QUERY
      SELECT gm.member_id
      FROM gdi_memberships gm
      WHERE gm.gdi_id = v_gdi_id;
    ELSIF 'leaders' = ANY(v_target_groups) THEN
      RETURN QUERY
      SELECT guide_id FROM gdis WHERE gdi_id = v_gdi_id
      UNION
      SELECT mentor_id FROM gdis WHERE gdi_id = v_gdi_id;
    END IF;
    RETURN;
  END IF;

  -- Si es de un Area, miembros del área según roles esperados
  IF v_area_id IS NOT NULL THEN
    IF 'workers' = ANY(v_target_groups) THEN
      RETURN QUERY
      SELECT am.member_id
      FROM area_memberships am
      WHERE am.area_id = v_area_id;
    ELSIF 'leaders' = ANY(v_target_groups) THEN
      RETURN QUERY
      SELECT leader_id FROM areas WHERE area_id = v_area_id
      UNION
      SELECT mentor_id FROM areas WHERE area_id = v_area_id;
    END IF;
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- 8. REPORTS - Ejemplo de query compleja para reportes
-- =====================================================
-- Obtiene estadísticas de asistencia de un miembro
CREATE OR REPLACE FUNCTION sp_get_member_attendance_stats(
  p_member_id INTEGER,
  p_year INTEGER
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'member_id', p_member_id,
    'year', p_year,
    'total_meetings', COUNT(DISTINCT a.meeting_id),
    'attended', COUNT(CASE WHEN a.was_present THEN 1 END),
    'active_participation', COUNT(CASE WHEN a.was_active THEN 1 END),
    'attendance_rate', ROUND(
      (COUNT(CASE WHEN a.was_present THEN 1 END)::NUMERIC / NULLIF(COUNT(DISTINCT a.meeting_id), 0)) * 100,
      2
    ),
    'by_role', (
      SELECT json_agg(
        json_build_object(
          'role', a.snapshot_role_general,
          'count', COUNT(*)
        )
      )
      FROM attendance a
      WHERE a.member_id = p_member_id
        AND EXTRACT(YEAR FROM a.created_at) = p_year
      GROUP BY a.snapshot_role_general
    )
  ) INTO result
  FROM attendance a
  INNER JOIN meetings m ON a.meeting_id = m.meeting_id
  WHERE a.member_id = p_member_id
    AND EXTRACT(YEAR FROM m.date) = p_year;

  RETURN result;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- TRIGGERS - Ejemplos de triggers automáticos
-- =====================================================

-- Trigger para recalcular roles automáticamente cuando cambia un GDI
CREATE OR REPLACE FUNCTION trigger_recalculate_roles_on_gdi_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalcular roles del guía/mentor anterior
  IF OLD.guide_id IS NOT NULL AND OLD.guide_id != NEW.guide_id THEN
    PERFORM sp_calculate_member_roles(OLD.guide_id);
  END IF;

  IF OLD.mentor_id IS NOT NULL AND OLD.mentor_id != NEW.mentor_id THEN
    PERFORM sp_calculate_member_roles(OLD.mentor_id);
  END IF;

  -- Recalcular roles del nuevo guía/mentor
  IF NEW.guide_id IS NOT NULL THEN
    PERFORM sp_calculate_member_roles(NEW.guide_id);
  END IF;

  IF NEW.mentor_id IS NOT NULL THEN
    PERFORM sp_calculate_member_roles(NEW.mentor_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger
CREATE TRIGGER gdis_recalculate_roles_trigger
AFTER UPDATE ON gdis
FOR EACH ROW
WHEN (OLD.guide_id IS DISTINCT FROM NEW.guide_id OR OLD.mentor_id IS DISTINCT FROM NEW.mentor_id)
EXECUTE FUNCTION trigger_recalculate_roles_on_gdi_change();


-- =====================================================
-- NOTAS DE USO
-- =====================================================
-- 1. Ejecuta estos stored procedures directamente en Neon
-- 2. Desde el código TypeScript, llámalos así:
--
--    const result = await this.executeStoredProcedure<Type[]>(
--      'sp_nombre_del_procedure',
--      [param1, param2, param3]
--    );
--
-- 3. Los tipos ENUM deben coincidir con los definidos en el schema
-- 4. Para transacciones complejas, usa this.withTransaction()
--
-- Ejemplo de uso en un repositorio:
--
-- async deleteMember(id: number): Promise<void> {
--   await this.executeStoredProcedure('sp_delete_member', [id]);
-- }
-- =====================================================

-- ============================================================================
-- Migración 005: Agregar Tipos de Audiencia para Reuniones
-- ============================================================================
-- Fecha: 2026-04-16
-- Descripción: Agrega nuevos valores al enum audience_type y campo de
--              configuración para audiencias personalizadas
-- ADR Relacionado: ADR-005 Tipos de Audiencia para Reuniones
-- ============================================================================

-- Agregar nuevos valores al enum de audience_type
-- NOTA: PostgreSQL no permite eliminar valores de enum, solo agregar
ALTER TYPE meeting_series_audience_type_enum ADD VALUE IF NOT EXISTS 'integrated';
ALTER TYPE meeting_series_audience_type_enum ADD VALUE IF NOT EXISTS 'workers';
ALTER TYPE meeting_series_audience_type_enum ADD VALUE IF NOT EXISTS 'leaders';
ALTER TYPE meeting_series_audience_type_enum ADD VALUE IF NOT EXISTS 'mentors';

-- Agregar campo para configuración de audiencia personalizada (by_categories)
-- Estructura esperada: {"positions": [...], "labels": [...], "combineMode": "OR"|"AND"}
ALTER TABLE meeting_series ADD COLUMN IF NOT EXISTS audience_config JSONB;

-- Agregar comentario descriptivo
COMMENT ON COLUMN meeting_series.audience_config IS 
'Configuración para audience_type=by_categories. 
Estructura: {
  "positions": ["guide", "area_leader", "mentor"], 
  "labels": ["Pastor", "Diácono"],
  "combineMode": "OR" | "AND"
}';

-- ============================================================================
-- Valores del enum después de la migración:
-- ============================================================================
-- | Valor       | Descripción                                    | Nivel Op |
-- |-------------|------------------------------------------------|----------|
-- | gdi         | Miembros de un GDI específico                  | N/A      |
-- | area        | Miembros de un Área específica                 | N/A      |
-- | all_active  | (DEPRECADO) Usar 'integrated' en su lugar      | N/A      |
-- | integrated  | Todos los integrados (nivel >= 1)              | >= 1     |
-- | workers     | Obreros (nivel >= 2)                           | >= 2     |
-- | leaders     | Líderes (nivel >= 3)                           | >= 3     |
-- | mentors     | Mentores (nivel == 4)                          | == 4     |
-- | by_categories | Audiencia personalizada via audience_config  | Config   |
-- ============================================================================

-- ============================================================================
-- Ejemplos de uso de audience_config:
-- ============================================================================
-- 
-- Solo Pastores y Ancianos (líderes eclesiásticos):
-- UPDATE meeting_series SET 
--   audience_type = 'by_categories',
--   audience_config = '{"labels": ["Pastor", "Anciano"], "combineMode": "OR"}'
-- WHERE series_id = X;
--
-- Guías que además son Diáconos:
-- UPDATE meeting_series SET 
--   audience_type = 'by_categories',
--   audience_config = '{"positions": ["guide"], "labels": ["Diácono"], "combineMode": "AND"}'
-- WHERE series_id = X;
--
-- ============================================================================

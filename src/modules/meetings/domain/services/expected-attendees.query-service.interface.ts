/**
 * Query Service Interface for Expected Attendees
 * 
 * Defined in Domain Layer (Dependency Inversion Principle)
 * Implemented in Infrastructure Layer
 * 
 * This service handles the cross-module query to get expected attendees
 * for a meeting based on the series' audienceType.
 * 
 * See ADR-004 (Clasificación de Miembros) and ADR-005 (Tipos de Audiencia)
 */

import { AudienceType } from '../../../../core/common/constants/status.constants';

export interface ExpectedAttendee {
  memberId: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

/**
 * Configuration for BY_CATEGORIES audience type
 * Allows filtering by role_types (ecclesiastical labels)
 */
export interface AudienceConfig {
  /** IDs of role_types to include */
  roleTypeIds?: number[];
  /** Names of role_types to include (alternative to IDs) */
  labels?: string[];
  /** How to combine multiple filters (default: OR) */
  combineMode?: 'OR' | 'AND';
}

export interface IExpectedAttendeesQueryService {
  /**
   * Get expected attendees based on audience type
   * 
   * @param audienceType - The type of audience (see AudienceType enum)
   * @param gdiId - GDI ID if audienceType is 'gdi'
   * @param areaId - Area ID if audienceType is 'area'
   * @param audienceConfig - Configuration for 'by_categories' audience type
   */
  getExpectedAttendees(
    audienceType: AudienceType,
    gdiId: number | null,
    areaId: number | null,
    audienceConfig: AudienceConfig | null,
  ): Promise<ExpectedAttendee[]>;
}

export const EXPECTED_ATTENDEES_QUERY_SERVICE = Symbol('EXPECTED_ATTENDEES_QUERY_SERVICE');

/**
 * Query Service Interface for Expected Attendees
 * 
 * Defined in Domain Layer (Dependency Inversion Principle)
 * Implemented in Infrastructure Layer
 * 
 * This service handles the cross-module query to get expected attendees
 * for a meeting based on the series' audienceType.
 */

import { AudienceType } from '../../../../core/common/constants/status.constants';

export interface ExpectedAttendee {
  memberId: number;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface IExpectedAttendeesQueryService {
  /**
   * Get expected attendees based on audience type and related IDs
   * 
   * @param audienceType - The type of audience (gdi, area, by_categories, all_active)
   * @param gdiId - GDI ID if audienceType is 'gdi'
   * @param areaId - Area ID if audienceType is 'area'
   * @param meetingTypeId - Meeting type ID if audienceType is 'by_categories'
   */
  getExpectedAttendees(
    audienceType: AudienceType,
    gdiId: number | null,
    areaId: number | null,
    meetingTypeId: number | null,
  ): Promise<ExpectedAttendee[]>;
}

export const EXPECTED_ATTENDEES_QUERY_SERVICE = Symbol('EXPECTED_ATTENDEES_QUERY_SERVICE');

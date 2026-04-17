/**
 * Read Model for Member with Assignments
 * 
 * This is a projection/view of member data with their GDI, Areas and Roles.
 * Used for read operations only - not for commands/mutations.
 * 
 * Following CQRS pattern: separates read models from aggregates.
 */

/**
 * GDI assignment info
 */
export interface GdiAssignment {
  readonly id: number;
  readonly name: string;
}

/**
 * Area assignment info
 */
export interface AreaAssignment {
  readonly id: number;
  readonly name: string;
}

/**
 * Member role types based on positions in GDIs and Areas
 */
export type MemberRoleType = 'GdiGuide' | 'GdiMentor' | 'AreaLeader' | 'AreaMentor' | 'Worker';

/**
 * Read Model: Member with all assignments
 * Immutable data structure for querying
 */
export interface MemberWithAssignmentsReadModel {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly fullName: string;
  readonly contact?: string;
  readonly recordStatus: string;
  readonly birthDate?: Date;
  readonly baptismDate?: Date;
  readonly joinDate?: Date;
  readonly bibleStudy: boolean;
  readonly typeBibleStudy?: string;
  readonly address?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  
  // Enriched data
  readonly assignedGdi?: GdiAssignment;
  readonly assignedAreas: AreaAssignment[];
  readonly roles: MemberRoleType[];
}

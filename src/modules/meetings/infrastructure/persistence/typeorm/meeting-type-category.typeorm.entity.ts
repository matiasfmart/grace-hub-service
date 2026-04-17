import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * TypeORM Entity: Meeting Type Categories (Junction Table)
 * 
 * M:N relationship between meeting_types and attendee_categories.
 * Defines which attendee categories should attend each meeting type.
 */
@Entity('meeting_type_categories')
export class MeetingTypeCategoryEntity {
  @PrimaryColumn({ name: 'meeting_type_id', type: 'integer' })
  meetingTypeId: number;

  @PrimaryColumn({ name: 'category_id', type: 'integer' })
  categoryId: number;
}

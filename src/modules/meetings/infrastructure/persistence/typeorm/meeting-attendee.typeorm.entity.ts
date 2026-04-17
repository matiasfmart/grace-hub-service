import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * TypeORM Entity: Meeting Attendees
 * 
 * Tracks expected attendees for a specific meeting instance.
 * Generated when a meeting instance is created based on:
 * - Group membership (for GDI/Area meetings)
 * - Category configuration (for general meetings)
 */
@Entity('meeting_attendees')
export class MeetingAttendeeEntity {
  @PrimaryGeneratedColumn({ name: 'meeting_attendee_id' })
  meetingAttendeeId: number;

  @Column({ name: 'meeting_id', type: 'integer' })
  meetingId: number;

  @Column({ name: 'member_id', type: 'integer' })
  memberId: number;

  @Column({ name: 'is_expected', type: 'boolean', default: true })
  isExpected: boolean;

  @Column({ name: 'category_snapshot', type: 'varchar', length: 50, nullable: true })
  categorySnapshot?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

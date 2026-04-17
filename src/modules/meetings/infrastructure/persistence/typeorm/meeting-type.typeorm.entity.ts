import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM Entity: Meeting Types
 * 
 * Configurable meeting types that define which attendee categories
 * should attend a general meeting.
 * 
 * Examples:
 * - "Reunión de Líderes" -> area_leader, gdi_guide
 * - "Reunión de Obreros" -> area_leader, area_member, gdi_guide, mentor
 */
@Entity('meeting_types')
export class MeetingTypeEntity {
  @PrimaryGeneratedColumn({ name: 'meeting_type_id' })
  meetingTypeId: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('meetings')
export class MeetingEntity {
  @PrimaryGeneratedColumn({ name: 'meeting_id' })
  meetingId: number;

  @Column({ name: 'series_id', type: 'integer', nullable: true })
  seriesId?: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'time', type: 'time', nullable: true })
  time?: string;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ name: 'is_manual', type: 'boolean', default: false })
  isManual: boolean;

  @Column({ name: 'minute', type: 'text', nullable: true })
  minute?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

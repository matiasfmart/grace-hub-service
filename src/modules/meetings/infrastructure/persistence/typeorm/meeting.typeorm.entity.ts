import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DateTransformer } from '../../../../../core/infrastructure/transformers';

@Entity('meetings')
export class MeetingEntity {
  @PrimaryGeneratedColumn({ name: 'meeting_id' })
  meetingId: number;

  @Column({ name: 'series_id', type: 'integer' })
  seriesId: number;

  @Column({ name: 'date', type: 'date', transformer: DateTransformer })
  date: Date;

  @Column({ name: 'time', type: 'time', nullable: true })
  time?: string;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

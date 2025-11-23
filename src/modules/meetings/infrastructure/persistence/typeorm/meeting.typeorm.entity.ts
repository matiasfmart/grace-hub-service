import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MeetingType } from '../../../../../core/common/constants/status.constants';

@Entity('meetings')
export class MeetingEntity {
  @PrimaryGeneratedColumn({ name: 'meeting_id' })
  meetingId: number;

  @Column({ name: 'series_name', type: 'varchar', length: 255 })
  seriesName: string;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({
    name: 'type',
    type: 'enum',
    enum: MeetingType,
    default: MeetingType.GENERAL,
  })
  type: MeetingType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

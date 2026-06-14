import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProspectStatus, ProspectSource } from '../../../domain/prospect.aggregate';

@Entity('prospects')
export class ProspectEntity {
  @PrimaryGeneratedColumn({ name: 'prospect_id' })
  prospectId: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'contact', type: 'varchar', length: 255, nullable: true })
  contact?: string;

  @Column({
    name: 'source',
    type: 'enum',
    enum: ProspectSource,
    enumName: 'prospects_source_enum',
    default: ProspectSource.MANUAL,
  })
  source: ProspectSource;

  @Column({ name: 'added_by', type: 'integer', nullable: true })
  addedBy?: number;

  @Column({ name: 'visit_at', type: 'timestamptz' })
  visitAt: Date;

  @Column({ name: 'meeting_series_id', type: 'integer', nullable: true })
  meetingSeriesId?: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ProspectStatus,
    enumName: 'prospects_status_enum',
    default: ProspectStatus.PENDING,
  })
  status: ProspectStatus;

  @Column({ name: 'member_id', type: 'integer', nullable: true })
  memberId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

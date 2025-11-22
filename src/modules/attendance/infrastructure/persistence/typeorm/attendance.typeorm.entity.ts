import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('attendance')
export class AttendanceEntity {
  @PrimaryGeneratedColumn({ name: 'attendance_id' })
  attendanceId: number;

  @Column({ name: 'meeting_id', type: 'integer' })
  meetingId: number;

  @Column({ name: 'member_id', type: 'integer' })
  memberId: number;

  @Column({ name: 'was_present', type: 'boolean' })
  wasPresent: boolean;

  @Column({ name: 'was_active', type: 'boolean', default: false })
  wasActive: boolean;

  @Column({ name: 'snapshot_role_general', type: 'varchar', length: 50, nullable: true })
  snapshotRoleGeneral?: string;

  @Column({ name: 'snapshot_role_specific', type: 'varchar', length: 100, nullable: true })
  snapshotRoleSpecific?: string;

  @Column({ name: 'snapshot_gdi_id', type: 'integer', nullable: true })
  snapshotGdiId?: number;

  @Column({ name: 'snapshot_area_id', type: 'integer', nullable: true })
  snapshotAreaId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

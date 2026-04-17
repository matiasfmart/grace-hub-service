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

  @Column({ name: 'snapshot_gdi_id', type: 'integer', nullable: true })
  snapshotGdiId?: number;

  @Column({ name: 'snapshot_area_id', type: 'integer', nullable: true })
  snapshotAreaId?: number;

  @Column({ name: 'snapshot_category', type: 'varchar', length: 50, nullable: true })
  snapshotCategory?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

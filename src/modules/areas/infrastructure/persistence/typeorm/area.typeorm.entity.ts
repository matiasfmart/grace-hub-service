import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('areas')
export class AreaEntity {
  @PrimaryGeneratedColumn({ name: 'area_id' })
  areaId: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'leader_id', type: 'integer', nullable: true })
  leaderId?: number;

  @Column({ name: 'mentor_id', type: 'integer', nullable: true })
  mentorId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

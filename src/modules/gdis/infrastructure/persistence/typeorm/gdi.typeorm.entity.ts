import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('gdis')
export class GdiEntity {
  @PrimaryGeneratedColumn({ name: 'gdi_id' })
  gdiId: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'guide_id', type: 'integer', nullable: true })
  guideId?: number;

  @Column({ name: 'mentor_id', type: 'integer', nullable: true })
  mentorId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

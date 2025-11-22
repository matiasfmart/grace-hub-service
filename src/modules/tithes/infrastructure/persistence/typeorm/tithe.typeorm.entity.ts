import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('tithes')
@Unique(['memberId', 'year', 'month'])
export class TitheEntity {
  @PrimaryGeneratedColumn({ name: 'tithe_id' })
  titheId: number;

  @Column({ name: 'member_id', type: 'integer' })
  memberId: number;

  @Column({ name: 'year', type: 'integer' })
  year: number;

  @Column({ name: 'month', type: 'integer' })
  month: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

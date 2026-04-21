import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
}

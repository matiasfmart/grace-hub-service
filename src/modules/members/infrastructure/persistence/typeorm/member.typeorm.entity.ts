import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MemberStatus } from '../../../../../core/common/constants/status.constants';

@Entity('members')
export class MemberEntity {
  @PrimaryGeneratedColumn({ name: 'member_id' })
  memberId: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'contact', type: 'varchar', length: 255, nullable: true })
  contact?: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.NEW,
  })
  status: MemberStatus;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ name: 'baptism_date', type: 'date', nullable: true })
  baptismDate?: Date;

  @Column({ name: 'join_date', type: 'date', nullable: true })
  joinDate?: Date;

  @Column({ name: 'bible_study', type: 'boolean', default: false })
  bibleStudy: boolean;

  @Column({ name: 'type_bible_study', type: 'varchar', length: 100, nullable: true })
  typeBibleStudy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

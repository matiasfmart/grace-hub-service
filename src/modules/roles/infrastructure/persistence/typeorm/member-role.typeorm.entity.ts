import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { RoleType } from '../../../../../core/common/constants/status.constants';

@Entity('member_roles')
export class MemberRoleEntity {
  @PrimaryGeneratedColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'member_id', type: 'integer' })
  memberId: number;

  @Column({
    name: 'role_general',
    type: 'enum',
    enum: RoleType,
  })
  roleGeneral: RoleType;

  @Column({ name: 'role_specific', type: 'varchar', length: 100, nullable: true })
  roleSpecific?: string;

  @Column({ name: 'context_type', type: 'varchar', length: 50, nullable: true })
  contextType?: string;

  @Column({ name: 'context_id', type: 'integer', nullable: true })
  contextId?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

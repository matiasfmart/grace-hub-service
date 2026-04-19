import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * TypeORM Entity: Role Type
 * 
 * Maps to the role_types table.
 * Stores ecclesiastical labels that can be assigned to members.
 */
@Entity('role_types')
export class RoleTypeEntity {
  @PrimaryGeneratedColumn({ name: 'role_type_id' })
  roleTypeId: number;

  @Column({ name: 'name', type: 'text', unique: true })
  name: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt?: Date;
}

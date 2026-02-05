import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('area_memberships')
export class AreaMembershipEntity {
  @PrimaryGeneratedColumn({ name: 'area_membership_id' })
  areaMembershipId: number;

  @Column({ name: 'area_id', type: 'integer' })
  areaId: number;

  @Column({ name: 'member_id', type: 'integer' })
  memberId: number;
}

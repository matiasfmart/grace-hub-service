import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gdi_memberships')
export class GdiMembershipEntity {
  @PrimaryGeneratedColumn({ name: 'gdi_membership_id' })
  gdiMembershipId: number;

  @Column({ name: 'gdi_id', type: 'integer' })
  gdiId: number;

  @Column({ name: 'member_id', type: 'integer' })
  memberId: number;
}

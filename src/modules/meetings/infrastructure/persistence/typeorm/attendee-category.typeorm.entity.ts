import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

/**
 * TypeORM Entity: Attendee Categories
 * 
 * Fixed catalog of attendee categories used to determine
 * who should attend general meetings.
 * 
 * Values:
 * - area_leader: Leaders of ministry areas
 * - area_member: Members of ministry areas
 * - gdi_guide: Guides of GDIs
 * - gdi_member: Members of GDIs
 * - mentor: Mentors of GDIs or Areas
 */
@Entity('attendee_categories')
export class AttendeeCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'code', type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

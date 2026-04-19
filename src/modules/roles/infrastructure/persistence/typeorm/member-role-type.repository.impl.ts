import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  IMemberRoleTypeRepository,
} from '../../../domain/repositories/member-role-type.repository.interface';
import { EcclesiasticalRole } from '../../../../members/domain/read-models/member-with-assignments.read-model';

/**
 * TypeORM Implementation: Member Role Type Repository
 *
 * Manages the member_roles join table directly via raw queries
 * to avoid introducing an ORM entity for a simple join table.
 *
 * Table schema:
 *   member_roles(member_id FK, role_type_id FK, UNIQUE(member_id, role_type_id))
 */
@Injectable()
export class MemberRoleTypeRepositoryImpl implements IMemberRoleTypeRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByMemberId(memberId: number): Promise<EcclesiasticalRole[]> {
    const rows: { role_type_id: number; name: string }[] =
      await this.dataSource.query(
        `SELECT rt.role_type_id, rt.name
         FROM member_roles mr
         JOIN role_types rt ON mr.role_type_id = rt.role_type_id
         WHERE mr.member_id = $1
         ORDER BY rt.name`,
        [memberId],
      );
    return rows.map((r) => ({ roleTypeId: r.role_type_id, name: r.name }));
  }

  async assign(memberId: number, roleTypeId: number): Promise<void> {
    // ON CONFLICT DO NOTHING makes this idempotent
    await this.dataSource.query(
      `INSERT INTO member_roles (member_id, role_type_id)
       VALUES ($1, $2)
       ON CONFLICT (member_id, role_type_id) DO NOTHING`,
      [memberId, roleTypeId],
    );
  }

  async unassign(memberId: number, roleTypeId: number): Promise<void> {
    await this.dataSource.query(
      `DELETE FROM member_roles
       WHERE member_id = $1 AND role_type_id = $2`,
      [memberId, roleTypeId],
    );
  }

  async isAssigned(memberId: number, roleTypeId: number): Promise<boolean> {
    const rows: { exists: boolean }[] = await this.dataSource.query(
      `SELECT EXISTS(
         SELECT 1 FROM member_roles
         WHERE member_id = $1 AND role_type_id = $2
       ) AS exists`,
      [memberId, roleTypeId],
    );
    return rows[0]?.exists ?? false;
  }
}

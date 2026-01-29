import { RoleType } from '../../../../core/common/constants/status.constants';

/**
 * Command: Update Role
 *
 * Immutable data structure representing user intent to update a MemberRole
 */
export class UpdateRoleCommand {
  constructor(
    public readonly id: number,
    public readonly roleGeneral?: RoleType,
  ) {}
}

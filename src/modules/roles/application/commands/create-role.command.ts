import { RoleType } from '../../../../core/common/constants/status.constants';

export class CreateRoleCommand {
  constructor(
    public readonly memberId: number,
    public readonly roleGeneral: RoleType,
  ) {}
}

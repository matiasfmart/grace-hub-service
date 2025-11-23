import { MemberStatus } from '../../../../core/common/constants/status.constants';

/**
 * Command for updating a member
 */
export class UpdateMemberCommand {
  constructor(
    public readonly memberId: number,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly contact?: string,
    public readonly status?: MemberStatus,
    public readonly birthDate?: Date,
    public readonly baptismDate?: Date,
    public readonly joinDate?: Date,
    public readonly bibleStudy?: boolean,
    public readonly typeBibleStudy?: string,
  ) {}
}

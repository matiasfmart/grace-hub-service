import { MemberStatus } from '../../../../core/common/constants';

/**
 * Command for creating a new member
 * Commands are immutable and represent user intent
 */
export class CreateMemberCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly contact?: string,
    public readonly status?: MemberStatus,
    public readonly birthDate?: Date,
    public readonly baptismDate?: Date,
    public readonly joinDate?: Date,
    public readonly bibleStudy?: boolean,
    public readonly typeBibleStudy?: string,
  ) {}
}

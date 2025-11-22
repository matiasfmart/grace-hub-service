import { MemberStatus } from '../../../core/common/constants';

export class Member {
  memberId: number;
  firstName: string;
  lastName: string;
  contact?: string;
  status: MemberStatus;
  birthDate?: Date;
  baptismDate?: Date;
  joinDate?: Date;
  bibleStudy: boolean;
  typeBibleStudy?: string;
  createdAt: Date;
  updatedAt: Date;
}

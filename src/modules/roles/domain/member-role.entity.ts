import { RoleType } from '../../../core/common/constants';

export class MemberRole {
  roleId: number;
  memberId: number;
  roleGeneral: RoleType;
  roleSpecific?: string;
  contextType?: string;
  contextId?: number;
  createdAt: Date;
  updatedAt: Date;
}

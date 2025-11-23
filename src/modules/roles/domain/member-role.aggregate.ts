import { AggregateRoot } from '../../../../core/domain/base/aggregate-root';
import { RoleAssignedEvent } from './events/role-assigned.event';
import { RoleType } from '../../../../core/common/constants';

export class MemberRole extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private readonly _memberId: number,
    private _roleGeneral: RoleType,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
  ) {
    super();
  }

  public static create(
    memberId: number,
    roleGeneral: RoleType,
  ): MemberRole {
    const role = new MemberRole(
      undefined,
      memberId,
      roleGeneral,
      new Date(),
      new Date(),
    );
    role.addDomainEvent(new RoleAssignedEvent(role));
    return role;
  }

  public static reconstitute(
    id: number,
    memberId: number,
    roleGeneral: RoleType,
    createdAt: Date,
    updatedAt: Date,
  ): MemberRole {
    return new MemberRole(id, memberId, roleGeneral, createdAt, updatedAt);
  }

  public updateRole(roleGeneral: RoleType): void {
    this._roleGeneral = roleGeneral;
    this._updatedAt = new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get memberId(): number {
    return this._memberId;
  }

  get roleGeneral(): RoleType {
    return this._roleGeneral;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }
}

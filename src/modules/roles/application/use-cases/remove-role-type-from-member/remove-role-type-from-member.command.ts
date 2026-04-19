/**
 * Command: Remove Role Type from Member
 * Immutable value object representing the intent to unassign an ecclesiastical label.
 */
export class RemoveRoleTypeFromMemberCommand {
  constructor(
    public readonly memberId: number,
    public readonly roleTypeId: number,
  ) {}
}

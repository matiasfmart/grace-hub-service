/**
 * Command: Assign Role Type to Member
 * Immutable value object representing the intent to assign an ecclesiastical label.
 */
export class AssignRoleTypeToMemberCommand {
  constructor(
    public readonly memberId: number,
    public readonly roleTypeId: number,
  ) {}
}

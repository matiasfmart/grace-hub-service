/**
 * Command: Assign Member to Area
 *
 * Immutable command representing the intent to add a member to an Area
 */
export class AssignMemberToAreaCommand {
  constructor(
    public readonly areaId: number,
    public readonly memberId: number,
  ) {}
}

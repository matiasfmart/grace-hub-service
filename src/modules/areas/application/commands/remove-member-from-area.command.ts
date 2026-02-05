/**
 * Command: Remove Member from Area
 *
 * Immutable command representing the intent to remove a member from an Area
 */
export class RemoveMemberFromAreaCommand {
  constructor(
    public readonly areaId: number,
    public readonly memberId: number,
  ) {}
}

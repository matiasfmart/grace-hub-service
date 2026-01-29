/**
 * Command: Get Roles By Member
 *
 * Immutable data structure representing user intent to get all Roles for a Member
 */
export class GetRolesByMemberCommand {
  constructor(
    public readonly memberId: number,
  ) {}
}

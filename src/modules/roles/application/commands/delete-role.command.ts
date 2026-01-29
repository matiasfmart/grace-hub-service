/**
 * Command: Delete Role
 *
 * Immutable data structure representing user intent to delete a MemberRole
 */
export class DeleteRoleCommand {
  constructor(
    public readonly id: number,
  ) {}
}

/**
 * Command: Update Role Type
 *
 * Immutable object representing the intention to rename a role type.
 */
export class UpdateRoleTypeCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}
}

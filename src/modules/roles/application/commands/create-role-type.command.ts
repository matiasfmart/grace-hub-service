/**
 * Command: Create Role Type
 * 
 * Immutable object representing the intention to create a new role type.
 */
export class CreateRoleTypeCommand {
  constructor(
    public readonly name: string,
  ) {}
}

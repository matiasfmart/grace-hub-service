/**
 * Command: Get Role By Id
 *
 * Immutable data structure representing user intent to get a Role by its ID
 */
export class GetRoleByIdCommand {
  constructor(
    public readonly id: number,
  ) {}
}

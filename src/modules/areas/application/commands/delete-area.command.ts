/**
 * Command: Delete Area
 *
 * Immutable data structure representing user intent to delete an Area
 */
export class DeleteAreaCommand {
  constructor(
    public readonly id: number,
  ) {}
}

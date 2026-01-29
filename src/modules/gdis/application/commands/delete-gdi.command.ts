/**
 * Command: Delete GDI
 *
 * Immutable data structure representing user intent to delete a GDI
 */
export class DeleteGdiCommand {
  constructor(
    public readonly id: number,
  ) {}
}

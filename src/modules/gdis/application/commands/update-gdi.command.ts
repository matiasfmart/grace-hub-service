/**
 * Command: Update GDI
 *
 * Immutable data structure representing user intent to update a GDI
 */
export class UpdateGdiCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly guideId?: number,
    public readonly mentorId?: number,
  ) {}
}

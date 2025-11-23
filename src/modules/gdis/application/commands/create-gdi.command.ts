/**
 * Command: Create GDI
 *
 * Immutable data structure representing user intent to create a GDI
 */
export class CreateGdiCommand {
  constructor(
    public readonly name: string,
    public readonly guideId?: number,
    public readonly mentorId?: number,
  ) {}
}

/**
 * Command: Assign Member to GDI
 *
 * Immutable command representing the intent to add a member to a GDI
 */
export class AssignMemberToGdiCommand {
  constructor(
    public readonly gdiId: number,
    public readonly memberId: number,
  ) {}
}

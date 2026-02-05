/**
 * Command: Remove Member from GDI
 *
 * Immutable command representing the intent to remove a member from a GDI
 */
export class RemoveMemberFromGdiCommand {
  constructor(
    public readonly gdiId: number,
    public readonly memberId: number,
  ) {}
}

/**
 * Command for deleting a member
 * Immutable command object following CQRS pattern
 */
export class DeleteMemberCommand {
  constructor(
    public readonly memberId: number,
  ) {}
}

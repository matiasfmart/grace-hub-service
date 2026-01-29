/**
 * Command: Delete Meeting
 *
 * Immutable data structure representing user intent to delete a Meeting
 */
export class DeleteMeetingCommand {
  constructor(
    public readonly id: number,
  ) {}
}

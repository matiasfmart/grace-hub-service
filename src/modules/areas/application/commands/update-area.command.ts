export class UpdateAreaCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly description?: string,
    public readonly leaderId?: number,
    public readonly mentorId?: number,
  ) {}
}

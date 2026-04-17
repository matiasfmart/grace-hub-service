export class CreateMeetingCommand {
  constructor(
    public readonly seriesId: number,
    public readonly date: Date,
    public readonly time?: string,
    public readonly location?: string,
    public readonly notes?: string,
  ) {}
}

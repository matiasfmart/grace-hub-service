export class UpdateMeetingCommand {
  constructor(
    public readonly id: number,
    public readonly date?: Date,
    public readonly time?: string,
    public readonly location?: string,
    public readonly notes?: string,
  ) {}
}

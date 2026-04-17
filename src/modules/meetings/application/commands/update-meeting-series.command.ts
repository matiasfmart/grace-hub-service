export class UpdateMeetingSeriesCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly defaultTime?: string | null,
    public readonly defaultLocation?: string | null,
    public readonly endDate?: Date | null,
  ) {}
}

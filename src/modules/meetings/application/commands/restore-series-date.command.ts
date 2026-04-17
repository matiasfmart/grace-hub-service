export class RestoreSeriesDateCommand {
  constructor(
    public readonly seriesId: number,
    public readonly date: Date,
  ) {}
}

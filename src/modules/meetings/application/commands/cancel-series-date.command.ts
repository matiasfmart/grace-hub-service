export class CancelSeriesDateCommand {
  constructor(
    public readonly seriesId: number,
    public readonly date: Date,
  ) {}
}

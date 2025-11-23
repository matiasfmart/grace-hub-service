export class CreateTitheCommand {
  constructor(
    public readonly memberId: number,
    public readonly year: number,
    public readonly month: number,
  ) {}
}

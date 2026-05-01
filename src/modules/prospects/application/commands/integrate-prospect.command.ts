export class IntegrateProspectCommand {
  constructor(
    public readonly prospectId: number,
    public readonly gdiId?: number,
  ) {}
}

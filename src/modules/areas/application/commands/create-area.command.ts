export class CreateAreaCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
  ) {}
}

export class CreateAreaCommand {
  constructor(
    public readonly name: string,
    public readonly description?: string,
    public readonly leaderId?: number,
    public readonly mentorId?: number,
  ) {}
}

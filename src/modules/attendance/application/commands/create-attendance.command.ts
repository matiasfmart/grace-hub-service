export class CreateAttendanceCommand {
  constructor(
    public readonly meetingId: number,
    public readonly memberId: number,
    public readonly wasPresent: boolean,
  ) {}
}

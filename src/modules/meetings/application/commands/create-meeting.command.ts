import { MeetingType } from '../../../../core/common/constants';

export class CreateMeetingCommand {
  constructor(
    public readonly seriesName: string,
    public readonly date: Date,
    public readonly type: MeetingType,
  ) {}
}

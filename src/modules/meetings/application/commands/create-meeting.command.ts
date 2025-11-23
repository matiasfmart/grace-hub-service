import { MeetingType } from '../../../../core/common/constants/status.constants';

export class CreateMeetingCommand {
  constructor(
    public readonly seriesName: string,
    public readonly date: Date,
    public readonly type: MeetingType,
  ) {}
}

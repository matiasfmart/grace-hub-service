import { MeetingType } from '../../../../core/common/constants/status.constants';

export class UpdateMeetingCommand {
  constructor(
    public readonly id: number,
    public readonly seriesName?: string,
    public readonly date?: Date,
    public readonly type?: MeetingType,
  ) {}
}

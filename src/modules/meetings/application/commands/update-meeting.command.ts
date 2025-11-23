import { MeetingType } from '../../../../core/common/constants';

export class UpdateMeetingCommand {
  constructor(
    public readonly id: number,
    public readonly seriesName?: string,
    public readonly date?: Date,
    public readonly type?: MeetingType,
  ) {}
}

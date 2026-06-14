import { ProspectSource } from '../../domain/prospect.aggregate';

export class CreateProspectCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly visitAt: Date,
    public readonly contact?: string,
    public readonly source: ProspectSource = ProspectSource.MANUAL,
    public readonly addedBy?: number,
    public readonly notes?: string,
    public readonly meetingSeriesId?: number,
  ) {}
}

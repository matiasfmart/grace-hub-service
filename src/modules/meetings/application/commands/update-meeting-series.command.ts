import { AudienceType } from '../../../../core/common/constants/status.constants';
import { AudienceConfig } from '../../domain/services/expected-attendees.query-service.interface';

export class UpdateMeetingSeriesCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly description?: string | null,
    public readonly defaultTime?: string | null,
    public readonly defaultLocation?: string | null,
    public readonly endDate?: Date | null,
    public readonly audienceType?: AudienceType,
    public readonly audienceConfig?: AudienceConfig | null,
  ) {}
}

import { ProspectStatus } from '../../../domain/prospect.aggregate';

export interface GetProspectsFilteredOptions {
  status?: ProspectStatus;
}

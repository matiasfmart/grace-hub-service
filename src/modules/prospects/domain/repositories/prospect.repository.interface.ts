import { Prospect, ProspectStatus } from '../prospect.aggregate';
import { GetProspectsFilteredOptions } from '../../application/use-cases/get-prospects-filtered/get-prospects-filtered.options';

export interface ProspectEditableFields {
  firstName?: string;
  lastName?: string;
  contact?: string;
  notes?: string;
  visitDate?: Date;
}

export interface IProspectRepository {
  save(prospect: Prospect): Promise<Prospect>;
  findById(id: number): Promise<Prospect | null>;
  findFiltered(options: GetProspectsFilteredOptions): Promise<Prospect[]>;
  countPending(): Promise<number>;
  update(id: number, data: Partial<{ status: ProspectStatus; memberId: number }>): Promise<Prospect>;
  updateFields(id: number, fields: ProspectEditableFields): Promise<Prospect>;
}

export const PROSPECT_REPOSITORY = Symbol('PROSPECT_REPOSITORY');

import { Area } from './area.entity';

export interface IAreaRepository {
  findAll(): Promise<Area[]>;
  findById(id: number): Promise<Area | null>;
  create(area: Partial<Area>): Promise<Area>;
  update(id: number, area: Partial<Area>): Promise<Area>;
  delete(id: number): Promise<void>;
}

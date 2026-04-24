import { Area } from '../area.aggregate';
import { AreaWithStats } from '../read-models/area-with-stats.read-model';

/**
 * Repository Interface for Area Aggregate
 *
 * Defined in Domain Layer (Dependency Inversion Principle)
 * Implemented in Infrastructure Layer
 */
export interface IAreaRepository {
  save(area: Area): Promise<Area>;
  findById(id: number): Promise<Area | null>;
  findAll(): Promise<Area[]>;
  /** Returns all Areas with computed health statistics (attendance %, last meeting date). */
  findAllWithStats(): Promise<AreaWithStats[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

/**
 * Injection token for Area Repository
 */
export const AREA_REPOSITORY = Symbol('AREA_REPOSITORY');

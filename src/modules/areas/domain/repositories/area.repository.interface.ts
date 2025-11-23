import { Area } from '../area.aggregate';

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
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

/**
 * Injection token for Area Repository
 */
export const AREA_REPOSITORY = Symbol('AREA_REPOSITORY');

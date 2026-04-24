import { Gdi } from '../gdi.aggregate';
import { GdiWithStats } from '../read-models/gdi-with-stats.read-model';

/**
 * Repository Interface for GDI Aggregate
 *
 * Defined in Domain Layer (Dependency Inversion Principle)
 * Implemented in Infrastructure Layer
 */
export interface IGdiRepository {
  save(gdi: Gdi): Promise<Gdi>;
  findById(id: number): Promise<Gdi | null>;
  findAll(): Promise<Gdi[]>;
  /** Returns all GDIs with computed health statistics (attendance %, last meeting date). */
  findAllWithStats(): Promise<GdiWithStats[]>;
  findByGuide(guideId: number): Promise<Gdi[]>;
  findByMentor(mentorId: number): Promise<Gdi[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

/**
 * Injection token for GDI Repository
 */
export const GDI_REPOSITORY = Symbol('GDI_REPOSITORY');

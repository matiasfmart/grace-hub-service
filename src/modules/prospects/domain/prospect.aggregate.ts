import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { ValidationException, BusinessRuleViolationException } from '../../../core/domain/exceptions/domain.exception';

export enum ProspectStatus {
  PENDING = 'pending',
  INTEGRATED = 'integrated',
  LOST = 'lost',
}

export enum ProspectSource {
  PWA = 'pwa',
  MANUAL = 'manual',
}

/**
 * Prospect Aggregate Root
 *
 * Represents a visitor registered by the welcome team.
 * A Prospect is NOT a Member — it becomes a Member when the admin integrates it.
 */
export class Prospect extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _firstName: string,
    private _lastName: string,
    private _contact: string | undefined,
    private _source: ProspectSource,
    private _addedBy: number | undefined,
    private _visitAt: Date,
    private _notes: string | undefined,
    private _status: ProspectStatus,
    private _memberId: number | undefined,
    private _meetingSeriesId: number | undefined,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  /**
   * Populated by the repository when doing JOINs.
   * Not domain state — purely read-model display fields.
   */
  public addedByName?: string;
  public meetingSeriesName?: string;

  // ─── Getters ────────────────────────────────────────────────────────────────
  get id(): number | undefined { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get contact(): string | undefined { return this._contact; }
  get source(): ProspectSource { return this._source; }
  get addedBy(): number | undefined { return this._addedBy; }
  get visitAt(): Date { return this._visitAt; }
  get notes(): string | undefined { return this._notes; }
  get meetingSeriesId(): number | undefined { return this._meetingSeriesId; }
  get status(): ProspectStatus { return this._status; }
  get memberId(): number | undefined { return this._memberId; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // ─── Factory: create new ────────────────────────────────────────────────────
  public static create(
    firstName: string,
    lastName: string,
    visitAt: Date,
    contact?: string,
    source: ProspectSource = ProspectSource.MANUAL,
    addedBy?: number,
    notes?: string,
    meetingSeriesId?: number,
  ): Prospect {
    if (!firstName || firstName.trim().length === 0) {
      throw new ValidationException('El nombre del prospecto no puede estar vacío');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new ValidationException('El apellido del prospecto no puede estar vacío');
    }
    if (!visitAt) {
      throw new ValidationException('La fecha de visita es requerida');
    }

    const now = new Date();
    return new Prospect(
      undefined,
      firstName.trim(),
      lastName.trim(),
      contact?.trim(),
      source,
      addedBy,
      visitAt,
      notes?.trim(),
      ProspectStatus.PENDING,
      undefined,
      meetingSeriesId,
      now,
      now,
    );
  }

  // ─── Factory: reconstitute from persistence ──────────────────────────────────
  public static reconstitute(
    id: number,
    firstName: string,
    lastName: string,
    contact: string | undefined,
    source: ProspectSource,
    addedBy: number | undefined,
    visitAt: Date,
    notes: string | undefined,
    status: ProspectStatus,
    memberId: number | undefined,
    meetingSeriesId: number | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Prospect {
    return new Prospect(id, firstName, lastName, contact, source, addedBy, visitAt, notes, status, memberId, meetingSeriesId, createdAt, updatedAt);
  }

  // ─── Business methods ─────────────────────────────────────────────────────────
  public integrate(memberId: number): void {
    if (this._status !== ProspectStatus.PENDING) {
      throw new BusinessRuleViolationException(
        `Solo se puede integrar un prospecto en estado 'pending'. Estado actual: '${this._status}'`,
      );
    }
    this._status = ProspectStatus.INTEGRATED;
    this._memberId = memberId;
    this._updatedAt = new Date();
  }

  public archive(): void {
    if (this._status !== ProspectStatus.PENDING) {
      throw new BusinessRuleViolationException(
        `Solo se puede archivar un prospecto en estado 'pending'. Estado actual: '${this._status}'`,
      );
    }
    this._status = ProspectStatus.LOST;
    this._updatedAt = new Date();
  }
}

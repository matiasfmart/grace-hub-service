import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { MemberStatus } from '../../../core/common/constants';
import { MemberName } from './value-objects/member-name.vo';
import { ContactInfo } from './value-objects/contact-info.vo';
import { MemberCreatedEvent } from './events/member-created.event';
import { MemberStatusChangedEvent } from './events/member-status-changed.event';

/**
 * Member Aggregate Root
 * Enforces all business rules and invariants
 */
export class Member extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _name: MemberName,
    private _contact: ContactInfo | undefined,
    private _status: MemberStatus,
    private _birthDate: Date | undefined,
    private _baptismDate: Date | undefined,
    private _joinDate: Date | undefined,
    private _bibleStudy: boolean,
    private _typeBibleStudy: string | undefined,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get name(): MemberName {
    return this._name;
  }

  get contact(): ContactInfo | undefined {
    return this._contact;
  }

  get status(): MemberStatus {
    return this._status;
  }

  get birthDate(): Date | undefined {
    return this._birthDate;
  }

  get baptismDate(): Date | undefined {
    return this._baptismDate;
  }

  get joinDate(): Date | undefined {
    return this._joinDate;
  }

  get bibleStudy(): boolean {
    return this._bibleStudy;
  }

  get typeBibleStudy(): string | undefined {
    return this._typeBibleStudy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Factory method for creating new members
  public static create(
    name: MemberName,
    contact: ContactInfo | undefined,
    status: MemberStatus = MemberStatus.NEW,
    birthDate?: Date,
    baptismDate?: Date,
    joinDate?: Date,
    bibleStudy: boolean = false,
    typeBibleStudy?: string,
  ): Member {
    const member = new Member(
      undefined, // id is undefined for new members
      name,
      contact,
      status,
      birthDate,
      baptismDate,
      joinDate,
      bibleStudy,
      typeBibleStudy,
      new Date(),
      new Date(),
    );

    // Raise domain event
    member.addDomainEvent(new MemberCreatedEvent(member));

    return member;
  }

  // Factory method for reconstituting from persistence
  public static reconstitute(
    id: number,
    name: MemberName,
    contact: ContactInfo | undefined,
    status: MemberStatus,
    birthDate: Date | undefined,
    baptismDate: Date | undefined,
    joinDate: Date | undefined,
    bibleStudy: boolean,
    typeBibleStudy: string | undefined,
    createdAt: Date,
    updatedAt: Date,
  ): Member {
    return new Member(
      id,
      name,
      contact,
      status,
      birthDate,
      baptismDate,
      joinDate,
      bibleStudy,
      typeBibleStudy,
      createdAt,
      updatedAt,
    );
  }

  // Business methods
  public updateName(name: MemberName): void {
    this._name = name;
    this.touch();
  }

  public updateContact(contact: ContactInfo | undefined): void {
    this._contact = contact;
    this.touch();
  }

  public changeStatus(newStatus: MemberStatus): void {
    if (this._status === newStatus) {
      return;
    }

    const oldStatus = this._status;
    this._status = newStatus;
    this.touch();

    // Raise domain event
    this.addDomainEvent(new MemberStatusChangedEvent(this, oldStatus, newStatus));
  }

  public markAsBaptized(baptismDate: Date): void {
    this._baptismDate = baptismDate;
    this.touch();
  }

  public enrollInBibleStudy(studyType: string): void {
    this._bibleStudy = true;
    this._typeBibleStudy = studyType;
    this.touch();
  }

  public withdrawFromBibleStudy(): void {
    this._bibleStudy = false;
    this._typeBibleStudy = undefined;
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}

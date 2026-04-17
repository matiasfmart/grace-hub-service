import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { SeriesName } from './value-objects/series-name.vo';
import { MeetingFrequency, AudienceType, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../core/common/constants/status.constants';

/**
 * Aggregate Root: Meeting Series
 *
 * Represents a template for recurring or one-time meetings.
 * Uses audienceType to determine who should attend:
 * - 'gdi': Members of a specific GDI
 * - 'area': Members of a specific Area
 * - 'by_categories': Members matching configured categories (via meetingTypeId)
 * - 'all_active': All active members
 *
 * Business Rules:
 * - audienceType='gdi' requires gdiId
 * - audienceType='area' requires areaId
 * - audienceType='by_categories' requires meetingTypeId
 * - audienceType='all_active' requires no FK
 */
export class MeetingSeries extends AggregateRoot {
  private constructor(
    private readonly _id: number | undefined,
    private _name: SeriesName,
    private _description: string | null,
    private _audienceType: AudienceType,
    private _gdiId: number | null,
    private _areaId: number | null,
    private _meetingTypeId: number | null,
    private _frequency: MeetingFrequency,
    private _startDate: Date,
    private _endDate: Date | null,
    private _defaultTime: string | null,
    private _defaultLocation: string | null,
    // Recurrence fields
    private _oneTimeDate: Date | null,
    private _weeklyDays: DayOfWeek[] | null,
    private _monthlyRuleType: MonthlyRuleType | null,
    private _monthlyDayOfMonth: number | null,
    private _monthlyWeekOrdinal: WeekOrdinal | null,
    private _monthlyDayOfWeek: DayOfWeek | null,
    private readonly _createdAt?: Date,
    private _updatedAt?: Date,
    private _cancelledDates: Date[] = [],
  ) {
    super();
  }

  /**
   * Factory: Create GDI Meeting Series
   */
  public static createForGdi(
    gdiId: number,
    name: SeriesName,
    frequency: MeetingFrequency,
    startDate: Date,
    options?: {
      meetingTypeId?: number;
      endDate?: Date;
      defaultTime?: string;
      defaultLocation?: string;
      description?: string;
      oneTimeDate?: Date;
      weeklyDays?: DayOfWeek[];
      monthlyRuleType?: MonthlyRuleType;
      monthlyDayOfMonth?: number;
      monthlyWeekOrdinal?: WeekOrdinal;
      monthlyDayOfWeek?: DayOfWeek;
    },
  ): MeetingSeries {
    return new MeetingSeries(
      undefined,
      name,
      options?.description || null,
      AudienceType.GDI,
      gdiId,
      null,
      options?.meetingTypeId || null,
      frequency,
      startDate,
      options?.endDate || null,
      options?.defaultTime || null,
      options?.defaultLocation || null,
      options?.oneTimeDate || null,
      options?.weeklyDays || null,
      options?.monthlyRuleType || null,
      options?.monthlyDayOfMonth || null,
      options?.monthlyWeekOrdinal || null,
      options?.monthlyDayOfWeek || null,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory: Create Ministry Area Meeting Series
   */
  public static createForArea(
    areaId: number,
    name: SeriesName,
    frequency: MeetingFrequency,
    startDate: Date,
    options?: {
      meetingTypeId?: number;
      endDate?: Date;
      defaultTime?: string;
      defaultLocation?: string;
      description?: string;
      oneTimeDate?: Date;
      weeklyDays?: DayOfWeek[];
      monthlyRuleType?: MonthlyRuleType;
      monthlyDayOfMonth?: number;
      monthlyWeekOrdinal?: WeekOrdinal;
      monthlyDayOfWeek?: DayOfWeek;
    },
  ): MeetingSeries {
    return new MeetingSeries(
      undefined,
      name,
      options?.description || null,
      AudienceType.AREA,
      null,
      areaId,
      options?.meetingTypeId || null,
      frequency,
      startDate,
      options?.endDate || null,
      options?.defaultTime || null,
      options?.defaultLocation || null,
      options?.oneTimeDate || null,
      options?.weeklyDays || null,
      options?.monthlyRuleType || null,
      options?.monthlyDayOfMonth || null,
      options?.monthlyWeekOrdinal || null,
      options?.monthlyDayOfWeek || null,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory: Create General Meeting Series (by categories)
   */
  public static createByCategories(
    meetingTypeId: number,
    name: SeriesName,
    frequency: MeetingFrequency,
    startDate: Date,
    options?: {
      endDate?: Date;
      defaultTime?: string;
      defaultLocation?: string;
      description?: string;
      oneTimeDate?: Date;
      weeklyDays?: DayOfWeek[];
      monthlyRuleType?: MonthlyRuleType;
      monthlyDayOfMonth?: number;
      monthlyWeekOrdinal?: WeekOrdinal;
      monthlyDayOfWeek?: DayOfWeek;
    },
  ): MeetingSeries {
    return new MeetingSeries(
      undefined,
      name,
      options?.description || null,
      AudienceType.BY_CATEGORIES,
      null,
      null,
      meetingTypeId,
      frequency,
      startDate,
      options?.endDate || null,
      options?.defaultTime || null,
      options?.defaultLocation || null,
      options?.oneTimeDate || null,
      options?.weeklyDays || null,
      options?.monthlyRuleType || null,
      options?.monthlyDayOfMonth || null,
      options?.monthlyWeekOrdinal || null,
      options?.monthlyDayOfWeek || null,
      new Date(),
      new Date(),
    );
  }

  /**
   * Factory: Create General Meeting Series (all active members)
   */
  public static createForAllActive(
    name: SeriesName,
    frequency: MeetingFrequency,
    startDate: Date,
    options?: {
      endDate?: Date;
      defaultTime?: string;
      defaultLocation?: string;
      description?: string;
      oneTimeDate?: Date;
      weeklyDays?: DayOfWeek[];
      monthlyRuleType?: MonthlyRuleType;
      monthlyDayOfMonth?: number;
      monthlyWeekOrdinal?: WeekOrdinal;
      monthlyDayOfWeek?: DayOfWeek;
    },
  ): MeetingSeries {
    return new MeetingSeries(
      undefined,
      name,
      options?.description || null,
      AudienceType.ALL_ACTIVE,
      null,
      null,
      null,
      frequency,
      startDate,
      options?.endDate || null,
      options?.defaultTime || null,
      options?.defaultLocation || null,
      options?.oneTimeDate || null,
      options?.weeklyDays || null,
      options?.monthlyRuleType || null,
      options?.monthlyDayOfMonth || null,
      options?.monthlyWeekOrdinal || null,
      options?.monthlyDayOfWeek || null,
      new Date(),
      new Date(),
    );
  }

  /**
   * Reconstitute from persistence
   */
  public static reconstitute(
    id: number,
    name: SeriesName,
    description: string | null,
    audienceType: AudienceType,
    gdiId: number | null,
    areaId: number | null,
    meetingTypeId: number | null,
    frequency: MeetingFrequency,
    startDate: Date,
    endDate: Date | null,
    defaultTime: string | null,
    defaultLocation: string | null,
    oneTimeDate: Date | null,
    weeklyDays: DayOfWeek[] | null,
    monthlyRuleType: MonthlyRuleType | null,
    monthlyDayOfMonth: number | null,
    monthlyWeekOrdinal: WeekOrdinal | null,
    monthlyDayOfWeek: DayOfWeek | null,
    createdAt: Date,
    updatedAt: Date,
    cancelledDates: Date[] = [],
  ): MeetingSeries {
    return new MeetingSeries(
      id,
      name,
      description,
      audienceType,
      gdiId,
      areaId,
      meetingTypeId,
      frequency,
      startDate,
      endDate,
      defaultTime,
      defaultLocation,
      oneTimeDate,
      weeklyDays,
      monthlyRuleType,
      monthlyDayOfMonth,
      monthlyWeekOrdinal,
      monthlyDayOfWeek,
      createdAt,
      updatedAt,
      cancelledDates,
    );
  }

  // ============================================
  // Getters
  // ============================================

  get id(): number | undefined {
    return this._id;
  }

  get name(): SeriesName {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get audienceType(): AudienceType {
    return this._audienceType;
  }

  get gdiId(): number | null {
    return this._gdiId;
  }

  get areaId(): number | null {
    return this._areaId;
  }

  get meetingTypeId(): number | null {
    return this._meetingTypeId;
  }

  get frequency(): MeetingFrequency {
    return this._frequency;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date | null {
    return this._endDate;
  }

  get defaultTime(): string | null {
    return this._defaultTime;
  }

  get defaultLocation(): string | null {
    return this._defaultLocation;
  }

  get oneTimeDate(): Date | null {
    return this._oneTimeDate;
  }

  get weeklyDays(): DayOfWeek[] | null {
    return this._weeklyDays;
  }

  get monthlyRuleType(): MonthlyRuleType | null {
    return this._monthlyRuleType;
  }

  get monthlyDayOfMonth(): number | null {
    return this._monthlyDayOfMonth;
  }

  get monthlyWeekOrdinal(): WeekOrdinal | null {
    return this._monthlyWeekOrdinal;
  }

  get monthlyDayOfWeek(): DayOfWeek | null {
    return this._monthlyDayOfWeek;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  get cancelledDates(): Date[] {
    return this._cancelledDates;
  }

  // Convenience getters
  get isGdiSeries(): boolean {
    return this._audienceType === AudienceType.GDI;
  }

  get isAreaSeries(): boolean {
    return this._audienceType === AudienceType.AREA;
  }

  get isGeneralSeries(): boolean {
    return this._audienceType === AudienceType.BY_CATEGORIES || this._audienceType === AudienceType.ALL_ACTIVE;
  }

  // ============================================
  // UPDATE METHODS
  // ============================================

  updateName(name: SeriesName): void {
    this._name = name;
    this._updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this._description = description;
    this._updatedAt = new Date();
  }

  updateDefaultTime(time: string | null): void {
    this._defaultTime = time;
    this._updatedAt = new Date();
  }

  updateDefaultLocation(location: string | null): void {
    this._defaultLocation = location;
    this._updatedAt = new Date();
  }

  updateEndDate(endDate: Date | null): void {
    this._endDate = endDate;
    this._updatedAt = new Date();
  }

  /**
   * Cancel a specific date for this series
   * The date will be added to cancelledDates if not already present
   */
  cancelDate(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    const alreadyCancelled = this._cancelledDates.some(
      d => d.toISOString().split('T')[0] === dateStr
    );
    if (!alreadyCancelled) {
      this._cancelledDates.push(date);
      this._updatedAt = new Date();
    }
  }

  /**
   * Restore a previously cancelled date
   */
  restoreDate(date: Date): void {
    const dateStr = date.toISOString().split('T')[0];
    const index = this._cancelledDates.findIndex(
      d => d.toISOString().split('T')[0] === dateStr
    );
    if (index !== -1) {
      this._cancelledDates.splice(index, 1);
      this._updatedAt = new Date();
    }
  }

  /**
   * Check if a date is cancelled
   */
  isDateCancelled(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return this._cancelledDates.some(
      d => d.toISOString().split('T')[0] === dateStr
    );
  }
}

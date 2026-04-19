import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MeetingFrequency, AudienceType, MonthlyRuleType, DayOfWeek, WeekOrdinal } from '../../../../../core/common/constants/status.constants';
import { DateTransformer } from '../../../../../core/infrastructure/transformers';

@Entity('meeting_series')
export class MeetingSeriesEntity {
  @PrimaryGeneratedColumn({ name: 'series_id' })
  seriesId: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({
    name: 'audience_type',
    type: 'enum',
    enum: AudienceType,
  })
  audienceType: AudienceType;

  @Column({ name: 'gdi_id', type: 'integer', nullable: true })
  gdiId?: number;

  @Column({ name: 'area_id', type: 'integer', nullable: true })
  areaId?: number;

  @Column({ name: 'meeting_type_id', type: 'integer', nullable: true })
  meetingTypeId?: number;

  /**
   * Configuration for BY_CATEGORIES audience type
   * Structure: { roleTypeIds?: number[], labels?: string[], combineMode?: 'OR' | 'AND' }
   */
  @Column({ name: 'audience_config', type: 'jsonb', nullable: true })
  audienceConfig?: Record<string, any>;

  @Column({
    name: 'frequency',
    type: 'enum',
    enum: MeetingFrequency,
    default: MeetingFrequency.ONE_TIME,
  })
  frequency: MeetingFrequency;

  @Column({ name: 'start_date', type: 'date', transformer: DateTransformer })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', transformer: DateTransformer, nullable: true })
  endDate?: Date;

  @Column({ name: 'default_time', type: 'time', nullable: true })
  defaultTime?: string;

  @Column({ name: 'default_location', type: 'varchar', length: 255, nullable: true })
  defaultLocation?: string;

  // Recurrence fields
  @Column({ name: 'one_time_date', type: 'date', transformer: DateTransformer, nullable: true })
  oneTimeDate?: Date;

  @Column({ name: 'weekly_days', type: 'text', array: true, nullable: true })
  weeklyDays?: string[];

  @Column({
    name: 'monthly_rule_type',
    type: 'enum',
    enum: MonthlyRuleType,
    nullable: true,
  })
  monthlyRuleType?: MonthlyRuleType;

  @Column({ name: 'monthly_day_of_month', type: 'integer', nullable: true })
  monthlyDayOfMonth?: number;

  @Column({
    name: 'monthly_week_ordinal',
    type: 'enum',
    enum: WeekOrdinal,
    nullable: true,
  })
  monthlyWeekOrdinal?: WeekOrdinal;

  @Column({
    name: 'monthly_day_of_week',
    type: 'enum',
    enum: DayOfWeek,
    nullable: true,
  })
  monthlyDayOfWeek?: DayOfWeek;

  @Column({ name: 'cancelled_dates', type: 'date', array: true, nullable: true, transformer: DateTransformer })
  cancelledDates?: Date[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

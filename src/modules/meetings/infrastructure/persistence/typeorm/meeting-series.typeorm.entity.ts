import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MeetingFrequency, DayOfWeek, MonthlyRuleType, WeekOrdinal } from '../../../../../core/common/constants';

@Entity('meeting_series')
export class MeetingSeriesEntity {
  @PrimaryGeneratedColumn({ name: 'series_id' })
  seriesId: number;

  @Column({ name: 'series_name', type: 'varchar', length: 255 })
  seriesName: string;

  @Column({
    name: 'frequency',
    type: 'enum',
    enum: MeetingFrequency,
  })
  frequency: MeetingFrequency;

  @Column({ name: 'is_general', type: 'boolean', default: false })
  isGeneral: boolean;

  @Column({ name: 'gdi_id', type: 'integer', nullable: true })
  gdiId?: number;

  @Column({ name: 'area_id', type: 'integer', nullable: true })
  areaId?: number;

  @Column({ name: 'default_time', type: 'time', nullable: true })
  defaultTime?: string;

  @Column({ name: 'default_location', type: 'varchar', length: 255, nullable: true })
  defaultLocation?: string;

  @Column({ name: 'target_attendee_groups', type: 'json' })
  targetAttendeeGroups: string[];

  @Column({ name: 'weekly_days', type: 'json', nullable: true })
  weeklyDays?: DayOfWeek[];

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

  @Column({ name: 'cancelled_dates', type: 'json', nullable: true })
  cancelledDates?: Date[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

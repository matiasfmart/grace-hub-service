import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsController } from './presentation/controllers/meetings.controller';
import { MeetingSeriesController } from './presentation/controllers/meeting-series.controller';
import { MeetingApplicationService } from './application/services/meeting-application.service';
import { CreateMeetingUseCase } from './application/use-cases/create-meeting/create-meeting.use-case';
import { GetAllMeetingsUseCase } from './application/use-cases/get-meeting/get-all-meetings.use-case';
import { GetMeetingByIdUseCase } from './application/use-cases/get-meeting/get-meeting-by-id.use-case';
import { UpdateMeetingUseCase } from './application/use-cases/update-meeting/update-meeting.use-case';
import { DeleteMeetingUseCase } from './application/use-cases/delete-meeting/delete-meeting.use-case';
import { CreateMeetingSeriesUseCase } from './application/use-cases/create-meeting-series/create-meeting-series.use-case';
import { GetAllMeetingSeriesUseCase } from './application/use-cases/get-meeting-series/get-all-meeting-series.use-case';
import { GetMeetingSeriesByIdUseCase } from './application/use-cases/get-meeting-series/get-meeting-series-by-id.use-case';
import { UpdateMeetingSeriesUseCase } from './application/use-cases/update-meeting-series/update-meeting-series.use-case';
import { DeleteMeetingSeriesUseCase } from './application/use-cases/delete-meeting-series/delete-meeting-series.use-case';
import { CancelSeriesDateUseCase } from './application/use-cases/cancel-series-date/cancel-series-date.use-case';
import { RestoreSeriesDateUseCase } from './application/use-cases/restore-series-date/restore-series-date.use-case';
import { GetExpectedAttendeesUseCase } from './application/use-cases/get-expected-attendees/get-expected-attendees.use-case';
import { MeetingEntity } from './infrastructure/persistence/typeorm/meeting.typeorm.entity';
import { MeetingSeriesEntity } from './infrastructure/persistence/typeorm/meeting-series.typeorm.entity';
import { MeetingTypeEntity } from './infrastructure/persistence/typeorm/meeting-type.typeorm.entity';
import { MeetingTypeCategoryEntity } from './infrastructure/persistence/typeorm/meeting-type-category.typeorm.entity';
import { MeetingAttendeeEntity } from './infrastructure/persistence/typeorm/meeting-attendee.typeorm.entity';
import { AttendeeCategoryEntity } from './infrastructure/persistence/typeorm/attendee-category.typeorm.entity';
import { MemberEntity } from '../members/infrastructure/persistence/typeorm/member.typeorm.entity';
import { MeetingRepositoryImpl } from './infrastructure/persistence/typeorm/meeting.repository.impl';
import { MeetingSeriesRepositoryImpl } from './infrastructure/persistence/typeorm/meeting-series.repository.impl';
import { ExpectedAttendeesQueryServiceImpl } from './infrastructure/services/expected-attendees.query-service.impl';
import { MEETING_REPOSITORY } from './domain/repositories/meeting.repository.interface';
import { MEETING_SERIES_REPOSITORY } from './domain/repositories/meeting-series.repository.interface';
import { EXPECTED_ATTENDEES_QUERY_SERVICE } from './domain/services/expected-attendees.query-service.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MeetingEntity,
      MeetingSeriesEntity,
      MeetingTypeEntity,
      MeetingTypeCategoryEntity,
      MeetingAttendeeEntity,
      AttendeeCategoryEntity,
      MemberEntity,
    ]),
  ],
  controllers: [MeetingsController, MeetingSeriesController],
  providers: [
    MeetingApplicationService,
    CreateMeetingUseCase,
    GetAllMeetingsUseCase,
    GetMeetingByIdUseCase,
    UpdateMeetingUseCase,
    DeleteMeetingUseCase,
    CreateMeetingSeriesUseCase,
    GetAllMeetingSeriesUseCase,
    GetMeetingSeriesByIdUseCase,
    UpdateMeetingSeriesUseCase,
    DeleteMeetingSeriesUseCase,
    CancelSeriesDateUseCase,
    RestoreSeriesDateUseCase,
    GetExpectedAttendeesUseCase,
    {
      provide: MEETING_REPOSITORY,
      useClass: MeetingRepositoryImpl,
    },
    {
      provide: MEETING_SERIES_REPOSITORY,
      useClass: MeetingSeriesRepositoryImpl,
    },
    {
      provide: EXPECTED_ATTENDEES_QUERY_SERVICE,
      useClass: ExpectedAttendeesQueryServiceImpl,
    },
  ],
  exports: [MeetingApplicationService],
})
export class MeetingsModule {}

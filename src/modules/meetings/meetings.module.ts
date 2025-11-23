import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsController } from './presentation/controllers/meetings.controller';
import { MeetingApplicationService } from './application/services/meeting-application.service';
import { CreateMeetingUseCase } from './application/use-cases/create-meeting/create-meeting.use-case';
import { GetAllMeetingsUseCase } from './application/use-cases/get-meeting/get-all-meetings.use-case';
import { GetMeetingByIdUseCase } from './application/use-cases/get-meeting/get-meeting-by-id.use-case';
import { UpdateMeetingUseCase } from './application/use-cases/update-meeting/update-meeting.use-case';
import { MeetingEntity } from './infrastructure/persistence/typeorm/meeting.typeorm.entity';
import { MeetingRepositoryImpl } from './infrastructure/persistence/typeorm/meeting.repository.impl';
import { MEETING_REPOSITORY } from './domain/repositories/meeting.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity])],
  controllers: [MeetingsController],
  providers: [
    MeetingApplicationService,
    CreateMeetingUseCase,
    GetAllMeetingsUseCase,
    GetMeetingByIdUseCase,
    UpdateMeetingUseCase,
    {
      provide: MEETING_REPOSITORY,
      useClass: MeetingRepositoryImpl,
    },
  ],
  exports: [MeetingApplicationService],
})
export class MeetingsModule {}

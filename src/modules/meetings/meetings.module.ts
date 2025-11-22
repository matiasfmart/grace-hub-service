import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsController } from './meetings.controller';
import { MeetingEntity } from './infrastructure/persistence/typeorm/meeting.typeorm.entity';
import { MeetingSeriesEntity } from './infrastructure/persistence/typeorm/meeting-series.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity, MeetingSeriesEntity])],
  controllers: [MeetingsController],
  providers: [
    // TODO: Agregar repositorios y use cases cuando se implementen
  ],
})
export class MeetingsModule {}

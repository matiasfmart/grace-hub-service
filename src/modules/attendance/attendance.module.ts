import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { AttendanceApplicationService } from './application/services/attendance-application.service';
import { CreateAttendanceUseCase } from './application/use-cases/create-attendance/create-attendance.use-case';
import { GetAllAttendancesUseCase } from './application/use-cases/get-attendance/get-all-attendances.use-case';
import { AttendanceEntity } from './infrastructure/persistence/typeorm/attendance.typeorm.entity';
import { AttendanceRepositoryImpl } from './infrastructure/persistence/typeorm/attendance.repository.impl';
import { ATTENDANCE_REPOSITORY } from './domain/repositories/attendance.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity])],
  controllers: [AttendanceController],
  providers: [
    AttendanceApplicationService,
    CreateAttendanceUseCase,
    GetAllAttendancesUseCase,
    {
      provide: ATTENDANCE_REPOSITORY,
      useClass: AttendanceRepositoryImpl,
    },
  ],
  exports: [AttendanceApplicationService],
})
export class AttendanceModule {}

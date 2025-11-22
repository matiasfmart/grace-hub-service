import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceEntity } from './infrastructure/persistence/typeorm/attendance.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceEntity])],
  controllers: [AttendanceController],
  providers: [
    // TODO: Agregar repositorios y use cases cuando se implementen
  ],
})
export class AttendanceModule {}

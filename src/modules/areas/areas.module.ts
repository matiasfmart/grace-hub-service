import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasController } from './areas.controller';
import { AreaEntity } from './infrastructure/persistence/typeorm/area.typeorm.entity';
import { AreaRepository } from './infrastructure/persistence/typeorm/area.repository';
import { GetAllAreasUseCase } from './application/use-cases/get-all-areas.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  controllers: [AreasController],
  providers: [
    AreaRepository,
    GetAllAreasUseCase,
  ],
  exports: [AreaRepository],
})
export class AreasModule {}

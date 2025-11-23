import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasController } from './presentation/controllers/areas.controller';
import { AreaApplicationService } from './application/services/area-application.service';
import { CreateAreaUseCase } from './application/use-cases/create-area/create-area.use-case';
import { GetAllAreasUseCase } from './application/use-cases/get-area/get-all-areas.use-case';
import { GetAreaByIdUseCase } from './application/use-cases/get-area/get-area-by-id.use-case';
import { UpdateAreaUseCase } from './application/use-cases/update-area/update-area.use-case';
import { AreaEntity } from './infrastructure/persistence/typeorm/area.typeorm.entity';
import { AreaRepositoryImpl } from './infrastructure/persistence/typeorm/area.repository.impl';
import { AREA_REPOSITORY } from './domain/repositories/area.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([AreaEntity])],
  controllers: [AreasController],
  providers: [
    AreaApplicationService,
    CreateAreaUseCase,
    GetAllAreasUseCase,
    GetAreaByIdUseCase,
    UpdateAreaUseCase,
    {
      provide: AREA_REPOSITORY,
      useClass: AreaRepositoryImpl,
    },
  ],
  exports: [AreaApplicationService],
})
export class AreasModule {}

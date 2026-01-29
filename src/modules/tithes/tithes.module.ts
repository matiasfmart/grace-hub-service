import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TithesController } from './presentation/controllers/tithes.controller';
import { TitheApplicationService } from './application/services/tithe-application.service';
import { CreateTitheUseCase } from './application/use-cases/create-tithe/create-tithe.use-case';
import { GetAllTithesUseCase } from './application/use-cases/get-tithe/get-all-tithes.use-case';
import { GetTithesByYearMonthUseCase } from './application/use-cases/get-tithe/get-tithes-by-year-month.use-case';
import { BatchUpsertTithesUseCase } from './application/use-cases/batch-upsert-tithes/batch-upsert-tithes.use-case';
import { TitheEntity } from './infrastructure/persistence/typeorm/tithe.typeorm.entity';
import { TitheRepositoryImpl } from './infrastructure/persistence/typeorm/tithe.repository.impl';
import { TITHE_REPOSITORY } from './domain/repositories/tithe.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([TitheEntity])],
  controllers: [TithesController],
  providers: [
    TitheApplicationService,
    CreateTitheUseCase,
    GetAllTithesUseCase,
    GetTithesByYearMonthUseCase,
    BatchUpsertTithesUseCase,
    {
      provide: TITHE_REPOSITORY,
      useClass: TitheRepositoryImpl,
    },
  ],
  exports: [TitheApplicationService],
})
export class TithesModule {}

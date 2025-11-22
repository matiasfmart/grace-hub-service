import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TithesController } from './tithes.controller';
import { TitheEntity } from './infrastructure/persistence/typeorm/tithe.typeorm.entity';
import { TitheRepository } from './infrastructure/persistence/typeorm/tithe.repository';
import { BatchUpsertTithesUseCase } from './application/use-cases/batch-upsert-tithes.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TitheEntity])],
  controllers: [TithesController],
  providers: [
    TitheRepository,
    BatchUpsertTithesUseCase,
  ],
  exports: [TitheRepository],
})
export class TithesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GdisController } from './gdis.controller';
import { GdiEntity } from './infrastructure/persistence/typeorm/gdi.typeorm.entity';
import { GdiRepository } from './infrastructure/persistence/typeorm/gdi.repository';
import { GetAllGdisUseCase } from './application/use-cases/get-all-gdis.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([GdiEntity])],
  controllers: [GdisController],
  providers: [
    GdiRepository,
    GetAllGdisUseCase,
  ],
  exports: [GdiRepository],
})
export class GdisModule {}

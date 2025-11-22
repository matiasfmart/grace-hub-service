import { Injectable } from '@nestjs/common';
import { TitheRepository } from '../../infrastructure/persistence/typeorm/tithe.repository';
import { Tithe } from '../../domain/tithe.entity';
import { BatchUpsertTitheDto } from '../dtos/batch-upsert-tithe.dto';

@Injectable()
export class BatchUpsertTithesUseCase {
  constructor(private readonly titheRepository: TitheRepository) {}

  async execute(dto: BatchUpsertTitheDto): Promise<Tithe[]> {
    // Aquí puedes agregar validaciones adicionales
    return await this.titheRepository.batchUpsert(dto.tithes);
  }
}

import { Injectable } from '@nestjs/common';
import { GdiRepository } from '../../infrastructure/persistence/typeorm/gdi.repository';
import { Gdi } from '../../domain/gdi.entity';

@Injectable()
export class GetAllGdisUseCase {
  constructor(private readonly gdiRepository: GdiRepository) {}

  async execute(): Promise<Gdi[]> {
    return await this.gdiRepository.findAll();
  }
}

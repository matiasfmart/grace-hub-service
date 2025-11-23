import { Injectable } from '@nestjs/common';
import { CreateGdiUseCase } from '../use-cases/create-gdi/create-gdi.use-case';
import { GetAllGdisUseCase } from '../use-cases/get-gdi/get-all-gdis.use-case';
import { GetGdiByIdUseCase } from '../use-cases/get-gdi/get-gdi-by-id.use-case';
import { UpdateGdiUseCase } from '../use-cases/update-gdi/update-gdi.use-case';
import { CreateGdiCommand } from '../commands/create-gdi.command';
import { UpdateGdiCommand } from '../commands/update-gdi.command';
import { Gdi } from '../../domain/gdi.aggregate';

/**
 * Application Service: GDI
 *
 * Orchestrates use cases and coordinates application flow
 * This is the entry point for the Application Layer
 */
@Injectable()
export class GdiApplicationService {
  constructor(
    private readonly createGdiUseCase: CreateGdiUseCase,
    private readonly getAllGdisUseCase: GetAllGdisUseCase,
    private readonly getGdiByIdUseCase: GetGdiByIdUseCase,
    private readonly updateGdiUseCase: UpdateGdiUseCase,
  ) {}

  async createGdi(command: CreateGdiCommand): Promise<Gdi> {
    return await this.createGdiUseCase.execute(command);
  }

  async getAllGdis(): Promise<Gdi[]> {
    return await this.getAllGdisUseCase.execute();
  }

  async getGdiById(id: number): Promise<Gdi> {
    return await this.getGdiByIdUseCase.execute(id);
  }

  async updateGdi(command: UpdateGdiCommand): Promise<Gdi> {
    return await this.updateGdiUseCase.execute(command);
  }
}

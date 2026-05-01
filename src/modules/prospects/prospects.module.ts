import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation
import { ProspectsController } from './presentation/controllers/prospects.controller';

// Application
import { ProspectApplicationService } from './application/services/prospect-application.service';
import { CreateProspectUseCase } from './application/use-cases/create-prospect/create-prospect.use-case';
import { GetProspectsFilteredUseCase } from './application/use-cases/get-prospects-filtered/get-prospects-filtered.use-case';
import { IntegrateProspectUseCase } from './application/use-cases/integrate-prospect/integrate-prospect.use-case';
import { ArchiveProspectUseCase } from './application/use-cases/archive-prospect/archive-prospect.use-case';
import { UpdateProspectFieldsUseCase } from './application/use-cases/update-prospect-fields/update-prospect-fields.use-case';

// Infrastructure
import { ProspectEntity } from './infrastructure/persistence/typeorm/prospect.typeorm.entity';
import { ProspectRepositoryImpl } from './infrastructure/persistence/typeorm/prospect.repository.impl';

// Domain
import { PROSPECT_REPOSITORY } from './domain/repositories/prospect.repository.interface';

// External modules
import { MembersModule } from '../members/members.module';
import { GdisModule } from '../gdis/gdis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProspectEntity]),
    MembersModule,
    GdisModule,
  ],
  controllers: [ProspectsController],
  providers: [
    // Application Services
    ProspectApplicationService,

    // Use Cases
    CreateProspectUseCase,
    GetProspectsFilteredUseCase,
    IntegrateProspectUseCase,
    ArchiveProspectUseCase,
    UpdateProspectFieldsUseCase,

    // Repository Implementation
    {
      provide: PROSPECT_REPOSITORY,
      useClass: ProspectRepositoryImpl,
    },
  ],
})
export class ProspectsModule {}

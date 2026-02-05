import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation Layer
import { GdisController } from './presentation/controllers/gdis.controller';

// Application Layer
import { GdiApplicationService } from './application/services/gdi-application.service';
import { CreateGdiUseCase } from './application/use-cases/create-gdi/create-gdi.use-case';
import { GetAllGdisUseCase } from './application/use-cases/get-gdi/get-all-gdis.use-case';
import { GetGdiByIdUseCase } from './application/use-cases/get-gdi/get-gdi-by-id.use-case';
import { UpdateGdiUseCase } from './application/use-cases/update-gdi/update-gdi.use-case';
import { DeleteGdiUseCase } from './application/use-cases/delete-gdi/delete-gdi.use-case';
import { AssignMemberToGdiUseCase } from './application/use-cases/gdi-membership/assign-member-to-gdi.use-case';
import { RemoveMemberFromGdiUseCase } from './application/use-cases/gdi-membership/remove-member-from-gdi.use-case';
import { GetGdiMembersUseCase } from './application/use-cases/gdi-membership/get-gdi-members.use-case';

// Infrastructure Layer
import { GdiEntity } from './infrastructure/persistence/typeorm/gdi.typeorm.entity';
import { GdiMembershipEntity } from './infrastructure/persistence/typeorm/gdi-membership.typeorm.entity';
import { GdiRepositoryImpl } from './infrastructure/persistence/typeorm/gdi.repository.impl';
import { GdiMembershipRepositoryImpl } from './infrastructure/persistence/typeorm/gdi-membership.repository.impl';

// Domain Layer
import { GDI_REPOSITORY } from './domain/repositories/gdi.repository.interface';
import { GDI_MEMBERSHIP_REPOSITORY } from './domain/repositories/gdi-membership.repository.interface';

/**
 * GDIs Module following Clean Architecture
 *
 * Dependency Flow:
 * Presentation → Application → Domain ← Infrastructure
 *
 * Key Principles Applied:
 * 1. Dependency Inversion: Application depends on repository interface (domain),
 *    not implementation (infrastructure)
 * 2. Single Responsibility: Each layer has one reason to change
 * 3. Separation of Concerns: Clear boundaries between layers
 */
@Module({
  imports: [TypeOrmModule.forFeature([GdiEntity, GdiMembershipEntity])],

  controllers: [GdisController],

  providers: [
    // Application Services
    GdiApplicationService,

    // Use Cases - GDI
    CreateGdiUseCase,
    GetAllGdisUseCase,
    GetGdiByIdUseCase,
    UpdateGdiUseCase,
    DeleteGdiUseCase,

    // Use Cases - GDI Membership
    AssignMemberToGdiUseCase,
    RemoveMemberFromGdiUseCase,
    GetGdiMembersUseCase,

    // Repository Implementations (bound to domain interfaces)
    {
      provide: GDI_REPOSITORY,
      useClass: GdiRepositoryImpl,
    },
    {
      provide: GDI_MEMBERSHIP_REPOSITORY,
      useClass: GdiMembershipRepositoryImpl,
    },
  ],

  exports: [
    // Export application service for other modules
    GdiApplicationService,
  ],
})
export class GdisModule {}

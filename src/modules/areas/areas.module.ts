import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasController } from './presentation/controllers/areas.controller';
import { AreaApplicationService } from './application/services/area-application.service';
import { CreateAreaUseCase } from './application/use-cases/create-area/create-area.use-case';
import { GetAllAreasUseCase } from './application/use-cases/get-area/get-all-areas.use-case';
import { GetAreaByIdUseCase } from './application/use-cases/get-area/get-area-by-id.use-case';
import { UpdateAreaUseCase } from './application/use-cases/update-area/update-area.use-case';
import { DeleteAreaUseCase } from './application/use-cases/delete-area/delete-area.use-case';
import { AssignMemberToAreaUseCase } from './application/use-cases/area-membership/assign-member-to-area.use-case';
import { RemoveMemberFromAreaUseCase } from './application/use-cases/area-membership/remove-member-from-area.use-case';
import { GetAreaMembersUseCase } from './application/use-cases/area-membership/get-area-members.use-case';
import { AreaEntity } from './infrastructure/persistence/typeorm/area.typeorm.entity';
import { AreaMembershipEntity } from './infrastructure/persistence/typeorm/area-membership.typeorm.entity';
import { AreaRepositoryImpl } from './infrastructure/persistence/typeorm/area.repository.impl';
import { AreaMembershipRepositoryImpl } from './infrastructure/persistence/typeorm/area-membership.repository.impl';
import { AREA_REPOSITORY } from './domain/repositories/area.repository.interface';
import { AREA_MEMBERSHIP_REPOSITORY } from './domain/repositories/area-membership.repository.interface';

// Import GDI module for cross-module dependency
import { GdisModule } from '../gdis/gdis.module';
import { GdiMembershipEntity } from '../gdis/infrastructure/persistence/typeorm/gdi-membership.typeorm.entity';
import { GdiMembershipRepositoryImpl } from '../gdis/infrastructure/persistence/typeorm/gdi-membership.repository.impl';
import { GDI_MEMBERSHIP_REPOSITORY } from '../gdis/domain/repositories/gdi-membership.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([AreaEntity, AreaMembershipEntity, GdiMembershipEntity]),
  ],
  controllers: [AreasController],
  providers: [
    // Application Services
    AreaApplicationService,

    // Use Cases - Area
    CreateAreaUseCase,
    GetAllAreasUseCase,
    GetAreaByIdUseCase,
    UpdateAreaUseCase,
    DeleteAreaUseCase,

    // Use Cases - Area Membership
    AssignMemberToAreaUseCase,
    RemoveMemberFromAreaUseCase,
    GetAreaMembersUseCase,

    // Repository Implementations
    {
      provide: AREA_REPOSITORY,
      useClass: AreaRepositoryImpl,
    },
    {
      provide: AREA_MEMBERSHIP_REPOSITORY,
      useClass: AreaMembershipRepositoryImpl,
    },
    // GDI Membership repo needed for validation
    {
      provide: GDI_MEMBERSHIP_REPOSITORY,
      useClass: GdiMembershipRepositoryImpl,
    },
  ],
  exports: [AreaApplicationService],
})
export class AreasModule {}

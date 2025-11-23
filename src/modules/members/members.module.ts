import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation Layer
import { MembersController } from './presentation/controllers/members.controller';

// Application Layer
import { MemberApplicationService } from './application/services/member-application.service';
import { CreateMemberUseCase } from './application/use-cases/create-member/create-member.use-case';
import { GetAllMembersUseCase } from './application/use-cases/get-member/get-all-members.use-case';
import { GetMemberByIdUseCase } from './application/use-cases/get-member/get-member-by-id.use-case';

// Infrastructure Layer
import { MemberEntity } from './infrastructure/persistence/typeorm/member.typeorm.entity';
import { MemberRepositoryImpl } from './infrastructure/persistence/typeorm/member.repository.impl';

// Domain Layer
import { MEMBER_REPOSITORY } from './domain/repositories/member.repository.interface';

/**
 * Members Module following Clean Architecture
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
  imports: [TypeOrmModule.forFeature([MemberEntity])],

  controllers: [MembersController],

  providers: [
    // Application Services
    MemberApplicationService,

    // Use Cases
    CreateMemberUseCase,
    GetAllMembersUseCase,
    GetMemberByIdUseCase,

    // Repository Implementation (bound to domain interface)
    {
      provide: MEMBER_REPOSITORY,
      useClass: MemberRepositoryImpl,
    },
  ],

  exports: [
    // Export application service for other modules
    MemberApplicationService,
  ],
})
export class MembersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './presentation/controllers/roles.controller';
import { RoleApplicationService } from './application/services/role-application.service';
import { CreateRoleUseCase } from './application/use-cases/create-role/create-role.use-case';
import { GetAllRolesUseCase } from './application/use-cases/get-role/get-all-roles.use-case';
import { MemberRoleEntity } from './infrastructure/persistence/typeorm/member-role.typeorm.entity';
import { MemberRoleRepositoryImpl } from './infrastructure/persistence/typeorm/member-role.repository.impl';
import { MEMBER_ROLE_REPOSITORY } from './domain/repositories/member-role.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([MemberRoleEntity])],
  controllers: [RolesController],
  providers: [
    RoleApplicationService,
    CreateRoleUseCase,
    GetAllRolesUseCase,
    {
      provide: MEMBER_ROLE_REPOSITORY,
      useClass: MemberRoleRepositoryImpl,
    },
  ],
  exports: [RoleApplicationService],
})
export class RolesModule {}

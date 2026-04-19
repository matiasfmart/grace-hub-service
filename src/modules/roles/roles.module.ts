import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleTypesController } from './presentation/controllers/role-types.controller';
import { CreateRoleTypeUseCase } from './application/use-cases/create-role-type/create-role-type.use-case';
import { GetAllRoleTypesUseCase } from './application/use-cases/get-all-role-types/get-all-role-types.use-case';
import { DeleteRoleTypeUseCase } from './application/use-cases/delete-role-type/delete-role-type.use-case';
import { UpdateRoleTypeUseCase } from './application/use-cases/update-role-type/update-role-type.use-case';
import { RoleTypeEntity } from './infrastructure/persistence/typeorm/role-type.typeorm.entity';
import { RoleTypeRepositoryImpl } from './infrastructure/persistence/typeorm/role-type.repository.impl';
import { MemberRoleTypeRepositoryImpl } from './infrastructure/persistence/typeorm/member-role-type.repository.impl';
import { ROLE_TYPE_REPOSITORY } from './domain/repositories/role-type.repository.interface';
import { MEMBER_ROLE_TYPE_REPOSITORY } from './domain/repositories/member-role-type.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleTypeEntity]),
  ],
  controllers: [RoleTypesController],
  providers: [
    CreateRoleTypeUseCase,
    GetAllRoleTypesUseCase,
    DeleteRoleTypeUseCase,
    UpdateRoleTypeUseCase,
    {
      provide: ROLE_TYPE_REPOSITORY,
      useClass: RoleTypeRepositoryImpl,
    },
    {
      provide: MEMBER_ROLE_TYPE_REPOSITORY,
      useClass: MemberRoleTypeRepositoryImpl,
    },
  ],
  exports: [
    ROLE_TYPE_REPOSITORY,
    MEMBER_ROLE_TYPE_REPOSITORY,
  ],
})
export class RolesModule {}

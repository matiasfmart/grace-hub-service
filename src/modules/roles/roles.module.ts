import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { MemberRoleEntity } from './infrastructure/persistence/typeorm/member-role.typeorm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberRoleEntity])],
  controllers: [RolesController],
  providers: [
    // TODO: Agregar repositorios y use cases cuando se implementen
  ],
})
export class RolesModule {}

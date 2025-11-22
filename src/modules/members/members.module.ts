import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersController } from './members.controller';
import { MemberEntity } from './infrastructure/persistence/typeorm/member.typeorm.entity';
import { MemberRepository } from './infrastructure/persistence/typeorm/member.repository';
import { GetAllMembersUseCase } from './application/use-cases/get-all-members.use-case';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MembersController],
  providers: [
    MemberRepository,
    GetAllMembersUseCase,
    CreateMemberUseCase,
  ],
  exports: [MemberRepository],
})
export class MembersModule {}

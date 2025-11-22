import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { Member } from '../../../domain/member.aggregate';
import { MemberName } from '../../../domain/value-objects/member-name.vo';
import { ContactInfo } from '../../../domain/value-objects/contact-info.vo';
import { CreateMemberCommand } from '../../commands/create-member.command';
import { MemberStatus } from '../../../../../core/common/constants';

/**
 * Use Case: Create a new Member
 *
 * Follows Single Responsibility Principle:
 * - Validates command
 * - Creates domain aggregate
 * - Persists via repository
 * - Publishes domain events (future)
 */
@Injectable()
export class CreateMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: CreateMemberCommand): Promise<Member> {
    // Create Value Objects (validation happens here)
    const name = MemberName.create(command.firstName, command.lastName);
    const contact = command.contact
      ? ContactInfo.create(command.contact)
      : undefined;

    // Create Domain Aggregate (business rules enforced)
    const member = Member.create(
      name,
      contact,
      command.status || MemberStatus.NEW,
      command.birthDate,
      command.baptismDate,
      command.joinDate,
      command.bibleStudy,
      command.typeBibleStudy,
    );

    // Persist aggregate
    const savedMember = await this.memberRepository.save(member);

    // TODO: Publish domain events
    // this.eventBus.publishAll(savedMember.domainEvents);

    return savedMember;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import {
  IMemberRepository,
  MEMBER_REPOSITORY,
} from '../../../domain/repositories/member.repository.interface';
import { Member } from '../../../domain/member.aggregate';
import { MemberName } from '../../../domain/value-objects/member-name.vo';
import { ContactInfo } from '../../../domain/value-objects/contact-info.vo';
import { UpdateMemberCommand } from '../../commands/update-member.command';
import { EntityNotFoundException } from '../../../../../core/domain/exceptions/domain.exception';

/**
 * Use Case: Update Member
 *
 * Application layer - orchestrates domain operations
 * Does NOT contain business logic (that's in the Domain)
 */
@Injectable()
export class UpdateMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly memberRepository: IMemberRepository,
  ) {}

  async execute(command: UpdateMemberCommand): Promise<Member> {
    // Find existing member
    const member = await this.memberRepository.findById(command.memberId);

    if (!member) {
      throw new EntityNotFoundException('Member', command.memberId);
    }

    // Update name if provided
    if (command.firstName || command.lastName) {
      const newName = MemberName.create(
        command.firstName || member.name.firstName,
        command.lastName || member.name.lastName,
      );
      member.updateName(newName);
    }

    // Update contact if provided
    if (command.contact !== undefined) {
      const newContact = command.contact
        ? ContactInfo.create(command.contact)
        : undefined;
      member.updateContact(newContact);
    }

    // Update status if provided
    if (command.status) {
      member.changeStatus(command.status);
    }

    // Update address if provided
    if (command.address !== undefined) {
      member.updateAddress(command.address);
    }

    // Persist changes
    const updatedMember = await this.memberRepository.save(member);

    // Clear domain events after persistence
    updatedMember.clearEvents();

    return updatedMember;
  }
}

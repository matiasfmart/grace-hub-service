import { Inject, Injectable } from '@nestjs/common';
import {
  IAreaMembershipRepository,
  AREA_MEMBERSHIP_REPOSITORY,
} from '../../../domain/repositories/area-membership.repository.interface';

/**
 * Use Case: Get Members of an Area
 *
 * Returns all member IDs assigned to a specific Area
 */
@Injectable()
export class GetAreaMembersUseCase {
  constructor(
    @Inject(AREA_MEMBERSHIP_REPOSITORY)
    private readonly membershipRepository: IAreaMembershipRepository,
  ) {}

  async execute(areaId: number): Promise<number[]> {
    return await this.membershipRepository.getMemberIdsByAreaId(areaId);
  }
}

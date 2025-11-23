import { IsNumber, IsEnum } from 'class-validator';
import { RoleType } from '../../../../core/common/constants';

export class CreateRoleDto {
  @IsNumber()
  memberId: number;

  @IsEnum(RoleType)
  roleGeneral: RoleType;
}

import { IsEnum, IsOptional } from 'class-validator';
import { RoleType } from '../../../../core/common/constants/status.constants';

export class UpdateRoleDto {
  @IsOptional()
  @IsEnum(RoleType)
  roleGeneral?: RoleType;
}

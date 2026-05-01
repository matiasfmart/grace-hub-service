import { IsOptional, IsEnum } from 'class-validator';
import { ProspectStatus } from '../../domain/prospect.aggregate';

export class GetProspectsFilteredDto {
  @IsOptional()
  @IsEnum(ProspectStatus)
  status?: ProspectStatus;
}

import { IsString } from 'class-validator';

export class TeamLoginDto {
  @IsString()
  teamCode: string;
}

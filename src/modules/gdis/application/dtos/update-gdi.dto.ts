import { PartialType } from '@nestjs/mapped-types';
import { CreateGdiDto } from './create-gdi.dto';

export class UpdateGdiDto extends PartialType(CreateGdiDto) {}

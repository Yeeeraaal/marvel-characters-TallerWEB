import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';


export enum CharacterStatusDto {
  ACTIVE = 'ACTIVE',
  INJURED = 'INJURED',
  MISSING = 'MISSING',
  RETIRED = 'RETIRED',
}

export class UpdateStatusDto {
  @ApiProperty({ enum: CharacterStatusDto, example: CharacterStatusDto.ACTIVE })
  @IsEnum(CharacterStatusDto)
  status: any;
}
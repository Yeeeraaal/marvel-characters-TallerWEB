import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../enums/character-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ enum: CharacterStatus, example: CharacterStatus.ACTIVE })
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
}
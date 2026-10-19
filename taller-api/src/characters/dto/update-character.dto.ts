import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CharacterStatus } from '../entities/character.entity';

export class UpdateStatusDto {
  @ApiProperty({ enum: CharacterStatus, example: CharacterStatus.ACTIVE })
  @IsEnum(CharacterStatus)
  status: CharacterStatus;
}
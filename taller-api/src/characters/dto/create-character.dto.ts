import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsBoolean, IsEnum } from 'class-validator';

export enum CharacterStatusDto {
  ACTIVE = 'ACTIVE',
  INJURED = 'INJURED',
  MISSING = 'MISSING',
  RETIRED = 'RETIRED',
}

export class CreateCharacterDto {
  @ApiProperty({ example: 'Spider-Man' })
  @IsString()
  @IsNotEmpty()
  alias: string;

  @ApiProperty({ example: 'Peter Parker' })
  @IsString()
  @IsNotEmpty()
  realName: string;

  @ApiProperty({ example: 'Spider-sense and agility' })
  @IsString()
  @IsNotEmpty()
  mainPower: string;

  @ApiProperty({ example: 78 })
  @IsInt()
  @Min(1)
  @Max(100)
  powerLevel: number;

  @ApiPropertyOptional({ enum: CharacterStatusDto, default: CharacterStatusDto.ACTIVE })
  @IsEnum(CharacterStatusDto)
  @IsOptional()
  status?: any;

  @ApiPropertyOptional({ example: false, default: false })
  @IsBoolean()
  @IsOptional()
  isVillain?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  teamId?: number;
}
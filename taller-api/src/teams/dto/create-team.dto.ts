import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Avengers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Avengers Tower, New York' })
  @IsString()
  @IsOptional()
  base?: string;

  @ApiPropertyOptional({ example: 1963 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @IsOptional()
  foundedYear?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @ApiPropertyOptional({ example: [1, 2], type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  characterIds?: number[];
}
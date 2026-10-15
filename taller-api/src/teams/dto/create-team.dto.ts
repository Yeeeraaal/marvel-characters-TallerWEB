import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Min, Max, IsBoolean } from 'class-validator';


export class CreateTeamDto {
@ApiProperty({ description: 'The name of the team' })
@IsString()
@IsNotEmpty()
name: string;
  
@ApiProperty({ description: 'The base of the team' })
@IsString()
@IsNotEmpty()
base: string;
  
@ApiProperty({ description: 'The year the team was founded' })
@IsNotEmpty()
@Min(1900)
@Max(2100)
foundedYear: number;
  
@ApiProperty({ description: 'Whether the team is active' })
@IsNotEmpty()
@IsBoolean()
active: boolean;
  
}

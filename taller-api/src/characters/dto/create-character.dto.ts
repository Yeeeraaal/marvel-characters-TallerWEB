import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Min, Max, IsBoolean } from 'class-validator';
export class CreateCharacterDto {
    @ApiProperty({ description: 'The name of the character' })
    @IsString()
    @IsNotEmpty()
    real_name: string;
    @ApiProperty({ description: 'The alias  of the character' })
    @IsString()
    @IsNotEmpty()
    alias: string;
    @ApiProperty({ description: 'The main power of the character' })
    @IsString()
    @IsNotEmpty()
    main_power: string;
    @ApiProperty({ description: 'power level of a hero' })
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    power_level: number;
    @ApiProperty({ description: 'estatus of the character' })
    @IsNotEmpty()
    estatus: string;
    @ApiProperty({ description: 'is a villian?' })
    @IsNotEmpty()
    @IsBoolean()
    is_villian: boolean;
    
}

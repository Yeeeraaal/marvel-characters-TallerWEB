import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CreateCharacterDto, CharacterStatusDto } from './dto/create-character.dto';
import { UpdateStatusDto } from './dto/update-character.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto): Promise<any> {
    return this.charactersService.create(createCharacterDto as any);
  }

  @Get()
  findAll(@Query('status') status?: CharacterStatusDto, @Query('teamId') teamId?: string): Promise<any> {
    return this.charactersService.findAll(status as any, teamId ? Number(teamId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.charactersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateCharacterDto): Promise<any> {
    return this.charactersService.update(id, dto as any);
  }

  @Patch(':id/status')
  changeStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto): Promise<any> {
    return this.charactersService.changeStatus(id, dto.status);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.charactersService.remove(id);
  }
}
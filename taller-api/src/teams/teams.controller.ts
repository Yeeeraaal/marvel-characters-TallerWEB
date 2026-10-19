import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AssignCharactersDto } from './dto/assign-characters.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) { }

  @Get()
  @ApiOperation({ summary: 'Lista todos los equipos' })
  findAll(): Promise<any> {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un equipo por su id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.teamsService.findOne(id);
  }

  @Get(':id/characters')
  @ApiOperation({ summary: 'Lista los personajes que pertenecen al equipo' })
  findCharacters(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.teamsService.findCharactersByTeam(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un equipo' })
  @ApiResponse({ status: 201, description: 'Equipo creado exitosamente' })
  create(@Body() createTeamDto: CreateTeamDto): Promise<any> {
    return this.teamsService.create(createTeamDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Reemplaza el equipo completo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<any> {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Patch(':id/characters')
  @ApiOperation({ summary: 'Asigna uno o varios personajes al equipo' })
  assignCharacters(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDto: AssignCharactersDto,
  ): Promise<any> {
    return this.teamsService.assignCharactersToTeam(id, assignDto.characterIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Elimina un equipo' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.teamsService.remove(id);
  }
}
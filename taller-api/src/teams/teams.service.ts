import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Team } from './entities/team.entity';
import { Character } from '../characters/entities/character.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Equipo con id ${id} no encontrado`);
    }
    return team;
  }

  async findCharactersByTeam(id: number): Promise<Character[]> {
    await this.findOne(id); // Valida la regla 1 (404 si el equipo no existe)
    return this.characterRepository.find({ where: { teamId: id } });
  }

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const existing = await this.teamRepository.findOne({
      where: { name: createTeamDto.name },
    });
    if (existing) {
      throw new ConflictException(`Ya existe un equipo con el nombre '${createTeamDto.name}'`);
    }

    const { characterIds, ...teamData } = createTeamDto;
    const team = this.teamRepository.create(teamData);
    const savedTeam = await this.teamRepository.save(team);

    if (characterIds && characterIds.length > 0) {
      await this.assignCharactersToTeam(savedTeam.id, characterIds);
    }

    return this.findOne(savedTeam.id);
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);

    if (updateTeamDto.name && updateTeamDto.name !== team.name) {
      const existing = await this.teamRepository.findOne({
        where: { name: updateTeamDto.name },
      });
      if (existing) {
        throw new ConflictException(`Ya existe un equipo con el nombre '${updateTeamDto.name}'`);
      }
    }

    const { characterIds, ...teamData } = updateTeamDto;
    Object.assign(team, teamData);
    await this.teamRepository.save(team);

    if (characterIds !== undefined) {
      await this.assignCharactersToTeam(team.id, characterIds);
    }

    return this.findOne(id);
  }

  async assignCharactersToTeam(teamId: number, characterIds: number[]): Promise<Team> {
    const team = await this.findOne(teamId);

    // Regla 5: El equipo debe estar activo
    if (!team.active) {
      throw new BadRequestException('No se pueden asignar personajes a un equipo inactivo');
    }

    if (characterIds.length > 0) {
      // Regla 5: Verificar que todos los personajes existan
      const characters = await this.characterRepository.find({
        where: { id: In(characterIds) },
      });

      if (characters.length !== characterIds.length) {
        throw new NotFoundException('Uno o más personajes no existen');
      }

    
      await this.characterRepository.update(
        { id: In(characterIds) },
        { teamId: team.id },
      );
    }

    return team;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    // Regla 6: No se puede eliminar si tiene personajes asociados
    const count = await this.characterRepository.count({ where: { teamId: id } });
    if (count > 0) {
      throw new ConflictException('No se puede eliminar un equipo que tiene personajes asociados');
    }

    await this.teamRepository.delete(id);
  }
}
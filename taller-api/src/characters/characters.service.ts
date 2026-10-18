import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
//esto sirve para que el servicio pueda tneer acceso a la base de datos
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character, CharacterStatus } from './entities/character.entity';
import { Team } from '../teams/entities/team.entity';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  //esto es lo que le trae la informacion de la base de datos
  constructor(
    @InjectRepository(Character) private characterRepo: Repository<Character>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
  ) {}

  // POST /characters
  async create(dto: CreateCharacterDto) {
    this.validarNivelDePoder(dto.powerLevel);
    this.validarStatus(dto.status);
    await this.validarAlias(dto.alias);
    await this.validarEquipo(dto.teamId);
    const nuevo = await this.characterRepo.save(dto);
    return this.findOne(nuevo.id);
  }

  // GET /characters?status=&teamId=
  // Si status o teamId no vienen, TypeORM los ignora y trae todos
  findAll(status?: CharacterStatus, teamId?: number) {
    this.validarStatus(status);
    return this.characterRepo.find({ where: { status, teamId } });
  }

  // GET /characters/:id
  findOne(id: number) {
    return this.validarQueExista(id);
  }

  // PUT /characters/:id (use el update para no crear un metodo nuevo)
  async update(id: number, dto: CreateCharacterDto) {
    const actual = await this.validarQueExista(id);
    this.validarNivelDePoder(dto.powerLevel);
    this.validarStatus(dto.status);
    await this.validarAlias(dto.alias, id);
    await this.validarEquipo(dto.teamId);

    const nuevoStatus = dto.status ?? CharacterStatus.ACTIVE;
    this.validarCambioDeEstado(actual.status, nuevoStatus);
    //se reemplaza todo tal y como se pide
    await this.characterRepo.update(id, {
      realName: dto.realName,
      alias: dto.alias,
      mainPower: dto.mainPower,
      powerLevel: dto.powerLevel,
      status: nuevoStatus,
      isVillain: dto.isVillain ?? false,
      teamId: dto.teamId ?? null,
    });
    return this.findOne(id);
  }

  // DELETE /characters/:id
  async remove(id: number) {
    await this.validarQueExista(id);
    await this.characterRepo.delete(id);
  }

  // PATCH /characters/:id/status
  async changeStatus(id: number, status: CharacterStatus) {
    const actual = await this.validarQueExista(id);
    this.validarStatus(status);
    this.validarCambioDeEstado(actual.status, status);

    await this.characterRepo.update(id, { status });
    return this.findOne(id);
  }


//reglas del negocio
// Regla 1: el personaje debe existir si no 404
private async validarQueExista (id:number) {
  //se hace esto proque en los endpoitns se pedia que al traer un character tambien traer la info del team
  const character = await this.characterRepo.findOne({
    where: { id },
    relations: { team: true }, // trae también los datos del equipo
  });
  if (!character) {
    throw new NotFoundException('El personaje no existe'); // Regla 1 para usar el 404
  }
  return character;
}
// regla 2:: no puede haber dos personajes con el mismo alias si no 409
private async validarAlias(alias: string, idActual?: number) {
  const existente = await this.characterRepo.findOneBy({ alias });
  if (existente && existente.id !== idActual) {
    throw new ConflictException('Ya existe un personaje con ese alias');
  }
}
// Regla 3: powerLevel entre 1 y 100 si no 400
private validarNivelDePoder(powerLevel: number) {
  if (powerLevel < 1 || powerLevel > 100) {
    throw new BadRequestException('El powerLevel debe estar entre 1 y 100');
  }
}
private validarStatus(status?: CharacterStatus) {
  if (status === undefined) return; // no se envió: se usará ACTIVE
  const validos = Object.values(CharacterStatus);
  if (!validos.includes(status)) {
    throw new BadRequestException(`El status debe ser uno de: ${validos.join(', ')}`);
  }
}
// Regla 4: si se envía teamId, el equipo debe existir (404) y estar activo (400)
private async validarEquipo(teamId?: number | null) {
  if (!teamId) return; // sin equipo: permitido
  const equipo = await this.teamRepo.findOneBy({ id: teamId });
  if (!equipo) {
    throw new NotFoundException('El equipo no existe');
  }
  if (!equipo.active) {
    throw new BadRequestException('El equipo no está activo');
  }
}

 // Regla 7: de RETIRED no se puede pasar directo a INJURED si no 400
private validarCambioDeEstado(actual: CharacterStatus, nuevo: CharacterStatus) {
  if (actual === CharacterStatus.RETIRED && nuevo === CharacterStatus.INJURED) {
    throw new BadRequestException('Un personaje RETIRED no puede pasar a INJURED');
  }
}
}


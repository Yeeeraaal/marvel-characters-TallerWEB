import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  base: string | null;

  @Column({ name: 'founded_year', type: 'int', nullable: true })
  foundedYear: number | null;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => Character, (character) => character.team)
  characters: Character[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
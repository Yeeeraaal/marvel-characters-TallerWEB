import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';


export enum CharacterStatus {
  ACTIVE = 'ACTIVE',
  INJURED = 'INJURED',
  MISSING = 'MISSING',
  RETIRED = 'RETIRED',
}

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'real_name', length: 100 })
  realName: string;

  @Column({ length: 100, unique: true })
  alias: string;

  @Column({ name: 'main_power', length: 150 })
  mainPower: string;

  @Column({ name: 'power_level', type: 'int' })
  powerLevel: number;

  @Column({ type: 'varchar', length: 20, default: CharacterStatus.ACTIVE })
  status: CharacterStatus;

  @Column({ name: 'is_villain', default: false })
  isVillain: boolean;

  @Column({ name: 'team_id', type: 'int', nullable: true })
  teamId: number | null;

  @ManyToOne(() => Team, (team) => team.characters, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

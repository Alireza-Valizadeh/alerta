import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from './enums/genders.enum';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.NOT_SPECIFIED })
  gender: Gender;

  @Column({ type: 'boolean', default: false })
  isAbandoned: boolean;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;
}

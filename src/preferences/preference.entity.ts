import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Preferences' })
export class Preference {
  @PrimaryGeneratedColumn()
  id: number;
}

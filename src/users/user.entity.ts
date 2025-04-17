import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Unique(['email'])
  email: string;

  @Column({ default: 'Not Set' })
  gender: string;

  @Column({ default: false })
  isAbandoned: boolean;

  @Column()
  phone: string;

  @Column()
  password: string;
}

import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity({ name: 'error_logs' })
export class LogError {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  context: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  stack: string | null;

  @Column({ type: 'jsonb', nullable: true })
  meta: object | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  timestamp: Date;
}

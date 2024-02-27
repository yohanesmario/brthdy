import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { JobStatus } from './jobStatus.enum';
import { JobType } from './jobType.enum';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  type: JobType;

  @Column()
  value: string;

  @Column({ nullable: true, default: null })
  @Index()
  refTable?: string;

  @Column({ nullable: true, default: null })
  @Index()
  refId?: number;

  @Column({ unique: true, nullable: true, default: null })
  uniqueIdentifier: string;

  @Column({ default: JobStatus.SCHEDULED })
  @Index()
  status: JobStatus;

  @Column({ type: 'datetime' })
  @Index()
  scheduledTime: Date;

  @Column({ nullable: true, default: null })
  @Index()
  accessorId: string;

  @Column({ type: 'datetime', nullable: true, default: null })
  @Index()
  lastAccessTime: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Organization } from '@org/data';

export type TaskStatus = 'Open' | 'In Progress' | 'On-Hold' | 'Completed';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

 @Column({ type: 'varchar', default: 'Open' })
  status: TaskStatus;

  @ManyToOne(() => Organization, { eager: true })
  organization: Organization;
}

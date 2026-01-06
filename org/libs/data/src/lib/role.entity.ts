import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum RoleType {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleType,
  })
  name: RoleType;

  @Column({ default: 1 })
  hierarchyLevel: number;
}

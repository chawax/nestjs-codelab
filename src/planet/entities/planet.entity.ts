import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'planet' })
export class Planet {
  @PrimaryGeneratedColumn('identity')
  id: string;

  @Column()
  name: string;

  @Column()
  distanceToEarth: number;
}

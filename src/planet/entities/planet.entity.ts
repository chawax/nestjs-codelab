import { DefaultEntity } from 'src/utils/default-entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'planet' })
export class Planet extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  distanceToEarth: number;
}

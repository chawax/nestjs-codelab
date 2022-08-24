import { Column, Entity, PrimaryKeyColumn } from "@homeofthings/nestjs-sqlite3";


@Entity({ name: 'planet' })
export class Planet {
  @PrimaryKeyColumn({ dbtype: 'INTEGER NOT NULL AUTOINCREMENT' })
  id: string;

  @Column()
  name: string;

  @Column()
  distanceToEarth: object;
}
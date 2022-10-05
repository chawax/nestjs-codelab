import { Exclude } from 'class-transformer';
import { Column, Generated, PrimaryGeneratedColumn } from 'typeorm';

export class DefaultEntity {
  @Exclude()
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column()
  active: boolean;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;
}

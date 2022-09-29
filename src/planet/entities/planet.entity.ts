import { Booking } from 'src/booking/entities/booking.entity';
import { DefaultEntity } from 'src/utils/default-entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'planet' })
export class Planet extends DefaultEntity {
  @Column()
  name: string;

  @Column()
  distanceToEarth: number;

  @OneToMany(() => Booking, (booking) => booking.destination)
  bookings: Planet[];
}

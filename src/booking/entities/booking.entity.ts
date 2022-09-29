import { Expose, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { Planet } from 'src/planet/entities/planet.entity';
import { Starship } from 'src/starship/entities/starship.entity';
import { DefaultEntity } from 'src/utils/default-entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Booking' })
export class Booking extends DefaultEntity {
  @ManyToOne(() => Planet, (planet) => planet.bookings)
  destination: Planet;

  @ManyToOne(() => Starship, (starship) => starship.bookings)
  starship: Starship;

  @Column()
  traveller: string;

  @Column()
  departureDate: Date;

  arrivalDate: Date;

  // Not a DB column
  @AfterLoad()
  travelTime() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice && this.starship?.speed) {
      const travelTime = this.destination.distanceToEarth / (this.starship.speed * 24);
      this.arrivalDate = new Date(dayjs(this.departureDate).add(travelTime, 'day').toISOString());
      return travelTime;
    }
  }

  // Not a DB column
  @AfterLoad()
  price() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice) {
      return this.destination.distanceToEarth * this.starship.kilometerPrice;
    }
  }
}

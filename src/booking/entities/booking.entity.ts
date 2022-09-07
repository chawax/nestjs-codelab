import { Expose, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { GROUP_USER } from 'src/app.module';
import { Planet } from 'src/planet/entities/planet.entity';
import { Starship } from 'src/starship/entities/starship.entity';
import { DefaultEntity } from 'src/utils/default-entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Booking' })
export class Booking extends DefaultEntity {
  @ManyToOne(() => Planet, (planet) => planet.bookings)
  @Expose({ groups: [GROUP_USER] })
  destination: Planet;

  @ManyToOne(() => Starship, (starship) => starship.bookings)
  @Expose({ groups: [GROUP_USER] })
  starship: Starship;

  @Column()
  @Expose({ groups: [GROUP_USER] })
  traveller: string;

  @Column()
  @Expose({ groups: [GROUP_USER] })
  departureDate: Date;

  @Expose({ groups: [GROUP_USER] })
  arrivalDate: Date;

  // Not a DB column
  @AfterLoad()
  @Expose({ groups: [GROUP_USER] })
  travelTime() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice && this.starship?.speed) {
      const travelTime = this.destination.distanceToEarth / (this.starship.speed * 24);
      this.arrivalDate = new Date(dayjs(this.departureDate).add(travelTime, 'day').toISOString());
      return travelTime;
    }
  }

  // Not a DB column
  @AfterLoad()
  @Expose({ groups: [GROUP_USER] })
  price() {
    if (this.destination?.distanceToEarth && this.starship?.kilometerPrice) {
      return this.destination.distanceToEarth * this.starship.kilometerPrice;
    }
  }
}

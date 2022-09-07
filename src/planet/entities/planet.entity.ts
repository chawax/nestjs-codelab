import { Expose } from 'class-transformer';
import { GROUP_ADMIN_USERS, GROUP_USER } from 'src/app.module';
import { Booking } from 'src/booking/entities/booking.entity';
import { DefaultEntity } from 'src/utils/default-entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'planet' })
export class Planet extends DefaultEntity {
  @Column()
  @Expose({ groups: [GROUP_USER, GROUP_ADMIN_USERS] })
  name: string;

  @Column()
  @Expose({ groups: [GROUP_USER, GROUP_ADMIN_USERS] })
  distanceToEarth: number;

  @OneToMany(() => Booking, (booking) => booking.destination)
  @Expose({ groups: [GROUP_USER, GROUP_ADMIN_USERS] })
  bookings: Planet[];
}

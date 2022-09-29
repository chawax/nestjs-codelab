import { Booking } from "src/booking/entities/booking.entity";
import { DefaultEntity } from "src/utils/default-entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity({ name: 'starship' })
export class Starship extends DefaultEntity {    
    @Column()
    name: string;

    @Column()
    speed: number;

    @Column()
    kilometerPrice: number;

    @OneToMany(() => Booking, (booking) => booking.starship)
    bookings: Starship[];
}

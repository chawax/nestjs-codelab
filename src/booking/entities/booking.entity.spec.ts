import { Planet } from 'src/planet/entities/planet.entity';
import { Booking } from './booking.entity';
import { Starship } from 'src/starship/entities/starship.entity';
import * as dayjs from 'dayjs';

describe('BookingEntity', () => {
  let destination: Planet;
  let starship: Starship;

  beforeAll(async () => {
    destination = {
      id: 1,
      uuid: 'uuid',
      active: true,
      name: 'Saturn',
      distanceToEarth: 1427000000,
    };
    starship = {
      id: 1,
      uuid: 'uuid',
      active: true,
      name: 'Enterprise',
      speed: 100000,
      kilometerPrice: 2500,
    };
  });

  it('Should calculate arrival date', () => {
    // --- ARRANGE
    const booking = new Booking();
    booking.destination = destination;
    booking.starship = starship;
    booking.departureDate = new Date('2023-04-04');

    // --- ACT
    booking.processTravelTime();

    // --- ASSERT
    expect(dayjs(booking.arrivalDate).format('YYYY-MM-DD')).toEqual('2024-11-19');
  });

  it('Should calculate travel price', () => {
    // --- ARRANGE
    const booking = new Booking();
    booking.destination = destination;
    booking.starship = starship;

    // --- ACT
    booking.processPrice();

    // --- ASSERT
    expect(booking.price).toEqual(3567500000000);
  });
});

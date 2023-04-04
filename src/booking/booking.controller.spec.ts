import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Planet } from 'src/planet/entities/planet.entity';
import { PlanetService } from 'src/planet/planet.service';
import { Starship } from 'src/starship/entities/starship.entity';
import { StarshipService } from 'src/starship/starship.service';
import { Repository } from 'typeorm';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './entities/booking.entity';

let destination = {
  id: 1,
  uuid: 'destination-uuid',
  active: true,
  name: 'Saturn',
  distanceToEarth: 1427000000,
};
let starship = {
  id: 1,
  uuid: 'starship-uuid',
  active: true,
  name: 'Enterprise',
  speed: 100000,
  kilometerPrice: 2500,
};

describe('BookingController', () => {
  let bookingController: BookingController;
  let bookingCreateDto: CreateBookingDto;
  let bookingUpdateDto: UpdateBookingDto;
  let bookingEntity: Booking;
  let planetRepository: Repository<Planet>;
  let starshipRepository: Repository<Starship>;
  let bookingRepository: Repository<Booking>;

  beforeEach(() => {
    bookingCreateDto = new CreateBookingDto();
    bookingCreateDto.destinationUuid = 'destination-uuid';
    bookingCreateDto.starshipUuid = 'starship-uuid';
    bookingCreateDto.departureDate = new Date('2023-04-04');
    bookingCreateDto.traveller = 'Michael Collins';

    bookingUpdateDto = new UpdateBookingDto();
    bookingUpdateDto.destinationUuid = 'destination-uuid';
    bookingUpdateDto.starshipUuid = 'starship-uuid';
    bookingUpdateDto.departureDate = new Date('2023-04-04');
    bookingUpdateDto.traveller = 'Michael Collins';

    bookingEntity = new Booking();
    bookingEntity.destination = destination;
    bookingEntity.starship = starship;
    bookingEntity.departureDate = new Date('2023-04-04');
    bookingEntity.traveller = 'Michael Collins';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        BookingService,
        PlanetService,
        StarshipService,
        {
          provide: getRepositoryToken(Booking),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Planet),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Starship),
          useClass: Repository,
        },
      ],
    }).compile();

    bookingController = module.get<BookingController>(BookingController);
    planetRepository = module.get<Repository<Planet>>(getRepositoryToken(Planet));
    starshipRepository = module.get<Repository<Starship>>(getRepositoryToken(Starship));
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
  });

  it('should be defined', () => {
    expect(bookingController).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking', async () => {
      // --- ARRANGE
      const planetRepoFindOneByUuidSpy = jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(destination);
      const starshipRepoFindOneByUuidSpy = jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(starship);
      const bookingRepoSaveSpy = jest.spyOn(bookingRepository, 'save').mockResolvedValueOnce(bookingEntity);

      // --- ACT
      const booking = await bookingController.create(bookingCreateDto);

      // --- ASSERT
      expect(planetRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: destination.uuid });
      expect(starshipRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: starship.uuid });
      expect(bookingRepoSaveSpy).toHaveBeenCalledWith(bookingEntity);
      expect(booking).toEqual(bookingEntity);
    });

    it('should throw an unprocessable entity exception', async () => {
      // --- ARRANGE
      jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(null);

      try {
        // --- ACT
        await bookingController.create(bookingCreateDto);
      } catch (exception) {
        // --- ASSERT
        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.message).toEqual('Both destination and starship should contains existing uuids');
      }
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      // --- ARRANGE
      const bookingRepoFindOneSpy = jest.spyOn(bookingRepository, 'findOne').mockResolvedValueOnce(bookingEntity);
      const planetRepoFindOneByUuidSpy = jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(destination);
      const starshipRepoFindOneByUuidSpy = jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(starship);
      const bookingRepoSaveSpy = jest.spyOn(bookingRepository, 'save').mockResolvedValueOnce(bookingEntity);

      // --- ACT
      const booking = await bookingController.update(bookingEntity.uuid, bookingUpdateDto);

      // --- ASSERT
      expect(bookingRepoFindOneSpy).toHaveBeenCalledWith({
        where: { uuid: booking.uuid },
        relations: ['starship', 'destination'],
      });
      expect(planetRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: destination.uuid });
      expect(starshipRepoFindOneByUuidSpy).toHaveBeenCalledWith({ uuid: starship.uuid });
      expect(bookingRepoSaveSpy).toHaveBeenCalledWith(bookingEntity);
      expect(booking).toEqual(bookingEntity);
    });

    it.each`
      destination    | starship    | errorMessage
      ${null}        | ${starship} | ${"The provided destination UUID doesn't map to an existing destination"}
      ${destination} | ${null}     | ${"The provided starship UUID doesn't map to an existing starship"}
    `('should throw unprocessables entities exceptions', async ({ destination, starship, errorMessage }) => {
      // --- ARRANGE
      jest.spyOn(bookingRepository, 'findOne').mockResolvedValueOnce(bookingEntity);
      jest.spyOn(planetRepository, 'findOneBy').mockResolvedValueOnce(destination);
      jest.spyOn(starshipRepository, 'findOneBy').mockResolvedValueOnce(starship);
      jest.spyOn(bookingRepository, 'save').mockResolvedValueOnce(bookingEntity);

      try {
        // --- ACT
        await bookingController.update(bookingEntity.uuid, bookingUpdateDto);
      } catch (exception) {
        // --- ASSERT
        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.message).toEqual(errorMessage);
      }
    });
  });
});

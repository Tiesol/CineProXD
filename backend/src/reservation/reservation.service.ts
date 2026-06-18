import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservedSeat } from './entities/reserved-seat.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ReservedSeat)
    private readonly reservedSeatRepository: Repository<ReservedSeat>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async create(userId: number, dto: CreateReservationDto): Promise<Reservation> {
    const { showtimeId, seats } = dto;

    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    if (!showtime) throw new NotFoundException(`Showtime #${showtimeId} not found`);

    for (const seat of seats) {
      const taken = await this.reservedSeatRepository.findOne({
        where: {
          showtime: { id: showtimeId },
          rowNum: seat.rowNum,
          colNum: seat.colNum,
        },
      });
      if (taken) {
        throw new ConflictException(
          `Seat row=${seat.rowNum} col=${seat.colNum} is already reserved for this showtime`,
        );
      }
    }

    const totalPrice = seats.length * Number(showtime.price);

    const reservation = this.reservationRepository.create({
      user: { id: userId },
      showtime: { id: showtimeId },
      totalPrice,
      seats: seats.map((s) =>
        this.reservedSeatRepository.create({
          showtime: { id: showtimeId },
          rowNum: s.rowNum,
          colNum: s.colNum,
        }),
      ),
    });

    return this.reservationRepository.save(reservation);
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: { showtime: { movie: true, room: true }, seats: true },
    });
  }

  async getSeatMap(showtimeId: number): Promise<{ rowNum: number; colNum: number }[]> {
    const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
    if (!showtime) throw new NotFoundException(`Showtime #${showtimeId} not found`);

    return this.reservedSeatRepository.find({
      where: { showtime: { id: showtimeId } },
      select: { rowNum: true, colNum: true },
    });
  }
}

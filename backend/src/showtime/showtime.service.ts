import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from 'src/movie/entities/movie.entity';
import { Room } from 'src/room/entities/room.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  private async checkOverlap(
    roomId: number,
    startTime: Date,
    endTime: Date,
    excludeId?: number,
  ): Promise<void> {
    const qb = this.showtimeRepository
      .createQueryBuilder('s')
      .where('s.room = :roomId', { roomId })
      .andWhere('s.startTime < :endTime', { endTime })
      .andWhere('s.endTime > :startTime', { startTime });

    if (excludeId) qb.andWhere('s.id != :excludeId', { excludeId });

    const count = await qb.getCount();
    if (count > 0) {
      throw new ConflictException('Room already has a showtime overlapping this time range');
    }
  }

  async create(dto: CreateShowtimeDto): Promise<Showtime> {
    const { movieId, roomId, startTime, endTime, price } = dto;

    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException(`Movie #${movieId} not found`);

    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException(`Room #${roomId} not found`);

    const start = new Date(startTime);
    const end = new Date(endTime);

    await this.checkOverlap(roomId, start, end);

    const showtime = this.showtimeRepository.create({ movie, room, startTime: start, endTime: end, price });
    return this.showtimeRepository.save(showtime);
  }

  async findAll(): Promise<Showtime[]> {
    return this.showtimeRepository.find({ relations: { movie: true, room: true } });
  }

  async findByMovie(movieId: number): Promise<Showtime[]> {
    return this.showtimeRepository.find({
      where: { movie: { id: movieId } },
      relations: { room: true },
    });
  }

  async findOne(id: number): Promise<Showtime> {
    const showtime = await this.showtimeRepository.findOne({
      where: { id },
      relations: { movie: true, room: true },
    });
    if (!showtime) throw new NotFoundException(`Showtime #${id} not found`);
    return showtime;
  }

  async update(id: number, dto: UpdateShowtimeDto): Promise<Showtime> {
    const showtime = await this.findOne(id);

    const roomId = dto.roomId ?? showtime.room.id;
    const start = new Date(dto.startTime ?? showtime.startTime);
    const end = new Date(dto.endTime ?? showtime.endTime);

    await this.checkOverlap(roomId, start, end, id);

    try {
      const toUpdate: Partial<Showtime> = {};
      if (dto.startTime) toUpdate.startTime = start;
      if (dto.endTime) toUpdate.endTime = end;
      if (dto.price !== undefined) toUpdate.price = dto.price;
      if (dto.movieId) toUpdate.movie = { id: dto.movieId } as Movie;
      if (dto.roomId) toUpdate.room = { id: dto.roomId } as Room;

      await this.showtimeRepository.save({ ...showtime, ...toUpdate });
      return this.findOne(id);
    } catch {
      throw new InternalServerErrorException('Failed to update showtime');
    }
  }

  async remove(id: number): Promise<void> {
    const showtime = await this.findOne(id);
    await this.showtimeRepository.remove(showtime);
  }
}

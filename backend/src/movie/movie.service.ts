import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  async findAll(genre?: string, title?: string): Promise<Movie[]> {
    const where: FindOptionsWhere<Movie> = {};
    if (genre) where.genre = ILike(`%${genre}%`);
    if (title) where.title = ILike(`%${title}%`);
    return this.movieRepository.find({ where });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: { showtimes: true },
    });
    if (!movie) throw new NotFoundException(`Movie #${id} not found`);
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.findOne(id);
    try {
      await this.movieRepository.update(id, updateMovieDto);
      return this.findOne(id);
    } catch {
      throw new InternalServerErrorException('Failed to update movie');
    }
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.movieRepository.remove(movie);
  }
}

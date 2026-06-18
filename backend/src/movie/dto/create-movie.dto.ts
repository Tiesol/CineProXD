import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { MovieClassification } from '../entities/movie.entity';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsInt()
  @IsPositive()
  durationMinutes: number;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(MovieClassification)
  classification: MovieClassification;

  @IsString()
  @IsNotEmpty()
  synopsis: string;
}

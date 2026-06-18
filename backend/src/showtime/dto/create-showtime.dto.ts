import { IsDateString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateShowtimeDto {
  @IsInt()
  @IsPositive()
  movieId: number;

  @IsInt()
  @IsPositive()
  roomId: number;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;
}

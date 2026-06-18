import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';

export class SeatDto {
  @IsInt()
  @Min(0)
  rowNum: number;

  @IsInt()
  @Min(0)
  colNum: number;
}

export class CreateReservationDto {
  @IsInt()
  @IsPositive()
  showtimeId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}

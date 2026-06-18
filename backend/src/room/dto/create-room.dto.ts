import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsPositive()
  quantityRow: number;

  @IsInt()
  @IsPositive()
  quantityColumn: number;
}

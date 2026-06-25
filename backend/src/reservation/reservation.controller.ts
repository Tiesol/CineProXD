import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { JwtUser } from 'src/auth/strategies/jwt.strategy';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: JwtUser, @Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(user.id, createReservationDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser() user: JwtUser) {
    return this.reservationService.findByUser(user.id);
  }

  @Get('seat-map/:showtimeId')
  getSeatMap(@Param('showtimeId', ParseIntPipe) showtimeId: number) {
    return this.reservationService.getSeatMap(showtimeId);
  }
}

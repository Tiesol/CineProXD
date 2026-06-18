import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservedSeat } from './entities/reserved-seat.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, ReservedSeat, Showtime]), AuthModule],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}

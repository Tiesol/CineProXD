import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Movie } from 'src/movie/entities/movie.entity';
import { Room } from 'src/room/entities/room.entity';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeService } from './showtime.service';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie, Room]), AuthModule],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
  exports: [ShowtimeService],
})
export class ShowtimeModule {}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';

@Entity()
@Unique('uq_seat_per_showtime', ['showtime', 'rowNum', 'colNum'])
export class ReservedSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.seats, { nullable: false })
  reservation: Reservation;

  @ManyToOne(() => Showtime, { nullable: false })
  showtime: Showtime;

  @Column()
  rowNum: number;

  @Column()
  colNum: number;
}

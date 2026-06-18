import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Showtime } from 'src/showtime/entities/showtime.entity';
import { ReservedSeat } from './reserved-seat.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, eager: false })
  user: User;

  @ManyToOne(() => Showtime, (showtime) => showtime.reservations, {
    nullable: false,
    eager: false,
  })
  showtime: Showtime;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ReservedSeat, (seat) => seat.reservation, { cascade: true, eager: true })
  seats: ReservedSeat[];
}

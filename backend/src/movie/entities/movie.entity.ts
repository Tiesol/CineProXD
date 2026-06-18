import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from 'src/showtime/entities/showtime.entity';

export enum MovieClassification {
  TODO_PUBLICO = 'Todo público',
  PLUS_14 = '+14',
  R = 'R',
}

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  durationMinutes: number;

  @Column()
  genre: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'enum', enum: MovieClassification })
  classification: MovieClassification;

  @Column({ type: 'text' })
  synopsis: string;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}

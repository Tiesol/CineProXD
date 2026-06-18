import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Showtime } from 'src/showtime/entities/showtime.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  quantityRow: number;

  @Column()
  quantityColumn: number;

  get totalCapacity(): number {
    return this.quantityRow * this.quantityColumn;
  }

  @OneToMany(() => Showtime, (showtime) => showtime.room)
  showtimes: Showtime[];
}

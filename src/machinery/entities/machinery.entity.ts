import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RentalRequest } from '../../rentals/entities/rental.entity';

@Entity('machinery')
export class Machinery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text' })
  description: string;

  // Specifications
  @Column({ nullable: true })
  power: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  capacity: string;

  @Column({ nullable: true })
  fuelType: string;

  // Pricing
  @Column({ type: 'float' })
  pricePerDay: number;

  @Column({ type: 'float', nullable: true })
  pricePerWeek: number;

  @Column({ type: 'float', nullable: true })
  pricePerMonth: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  // Location
  @Column()
  address: string;

  @Column()
  municipality: string;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ type: 'varchar', default: 'disponible' })
  status: 'disponible' | 'alquilada' | 'mantenimiento';

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.machinery, { onDelete: 'CASCADE' })
  owner: User;

  @OneToMany(() => RentalRequest, (request) => request.machinery)
  rentalRequests: RentalRequest[];
}

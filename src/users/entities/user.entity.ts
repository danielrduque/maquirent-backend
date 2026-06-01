import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Machinery } from '../../machinery/entities/machinery.entity';
import { RentalRequest } from '../../rentals/entities/rental.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ type: 'varchar', default: 'contratista' })
  role: 'propietario' | 'contratista';

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Machinery, (machinery) => machinery.owner)
  machinery: Machinery[];

  @OneToMany(() => RentalRequest, (request) => request.contractor)
  rentalRequests: RentalRequest[];

  @OneToMany(() => RentalRequest, (request) => request.owner)
  receivedRequests: RentalRequest[];
}

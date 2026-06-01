import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Machinery } from '../../machinery/entities/machinery.entity';

@Entity('rental_requests')
export class RentalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  machineryId: string;

  @ManyToOne(() => Machinery, (machinery) => machinery.rentalRequests, { onDelete: 'CASCADE' })
  machinery: Machinery;

  @Column()
  ownerId: string;

  @ManyToOne(() => User, (user) => user.receivedRequests, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  contractorId: string;

  @ManyToOne(() => User, (user) => user.rentalRequests, { onDelete: 'CASCADE' })
  contractor: User;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'float' })
  totalPrice: number;

  @Column({ type: 'varchar', default: 'pendiente' })
  status: 'pendiente' | 'aprobada' | 'rechazada' | 'activa' | 'completada' | 'cancelada';

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}

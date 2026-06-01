import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RentalRequest } from './entities/rental.entity';
import { MachineryService } from '../machinery/machinery.service';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(RentalRequest)
    private readonly rentalsRepository: Repository<RentalRequest>,
    private readonly machineryService: MachineryService,
  ) {}

  async create(data: any, contractorId: string): Promise<RentalRequest> {
    const machinery = await this.machineryService.findOne(data.machineryId);
    if (machinery.status !== 'disponible') {
      throw new BadRequestException('Esta maquinaria no está disponible para alquiler');
    }

    if (machinery.ownerId === contractorId) {
      throw new BadRequestException('No puedes alquilar tu propia maquinaria');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const totalPrice = diffDays * machinery.pricePerDay;

    const rentalRequest = this.rentalsRepository.create({
      machineryId: machinery.id,
      ownerId: machinery.ownerId,
      contractorId,
      startDate,
      endDate,
      totalPrice,
      message: data.message || '',
      status: 'pendiente',
    });

    return this.rentalsRepository.save(rentalRequest);
  }

  async findAll(userId: string, role: string): Promise<RentalRequest[]> {
    const query = this.rentalsRepository.createQueryBuilder('rental')
      .leftJoinAndSelect('rental.machinery', 'machinery')
      .leftJoinAndSelect('rental.contractor', 'contractor')
      .leftJoinAndSelect('rental.owner', 'owner')
      .select([
        'rental',
        'machinery.id',
        'machinery.title',
        'machinery.pricePerDay',
        'contractor.id',
        'contractor.name',
        'contractor.phone',
        'contractor.email',
        'owner.id',
        'owner.name',
        'owner.phone',
        'owner.email'
      ]);

    if (role === 'propietario') {
      query.where('rental.ownerId = :userId', { userId });
    } else {
      query.where('rental.contractorId = :userId', { userId });
    }

    query.orderBy('rental.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<RentalRequest> {
    const request = await this.rentalsRepository.findOne({
      where: { id },
      relations: ['machinery'],
    });
    if (!request) {
      throw new NotFoundException('Solicitud de alquiler no encontrada');
    }
    return request;
  }

  async updateStatus(id: string, status: string, userId: string): Promise<RentalRequest> {
    const request = await this.findOne(id);

    if (request.ownerId !== userId && request.contractorId !== userId) {
      throw new BadRequestException('No estas autorizado para modificar esta solicitud');
    }

    request.status = status as any;

    const savedRequest = await this.rentalsRepository.save(request);

    if (status === 'aprobada' || status === 'activa') {
      await this.machineryService.updateStatus(request.machineryId, 'alquilada');
    } else if (status === 'rechazada' || status === 'cancelada' || status === 'completada') {
      await this.machineryService.updateStatus(request.machineryId, 'disponible');
    }

    return savedRequest;
  }
}

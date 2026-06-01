import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machinery } from './entities/machinery.entity';

@Injectable()
export class MachineryService {
  constructor(
    @InjectRepository(Machinery)
    private readonly machineryRepository: Repository<Machinery>,
  ) {}

  private transformLocation(machinery: any): any {
    if (!machinery) return null;
    // Convert entity to a plain object to strip prototype and TypeORM metadata/getters
    const plain = JSON.parse(JSON.stringify(machinery));
    const { address, municipality, lat, lng, power, weight, capacity, fuelType, ...rest } = plain;
    return {
      ...rest,
      location: {
        address,
        municipality,
        lat,
        lng,
      },
      specifications: {
        power,
        weight,
        capacity,
        fuelType,
      },
    };
  }

  async create(data: any, ownerId: string): Promise<any> {
    const machinery = this.machineryRepository.create({
      ...data,
      ownerId,
      status: 'disponible',
      rating: 5.0,
      reviewCount: 0,
      images: data.images || ['/machinery/excavadora-1.jpg'],
    });
    const saved = await this.machineryRepository.save(machinery);
    return this.transformLocation(saved);
  }

  async findAll(filters: any): Promise<any[]> {
    const query = this.machineryRepository.createQueryBuilder('machinery')
      .leftJoinAndSelect('machinery.owner', 'owner')
      .select([
        'machinery',
        'owner.id',
        'owner.name',
        'owner.phone',
        'owner.email'
      ]);

    if (filters.category) {
      query.andWhere('machinery.category = :category', { category: filters.category });
    }

    if (filters.municipality) {
      query.andWhere('machinery.municipality = :municipality', { municipality: filters.municipality });
    }

    if (filters.status) {
      query.andWhere('machinery.status = :status', { status: filters.status });
    }

    if (filters.minPrice) {
      query.andWhere('machinery.pricePerDay >= :minPrice', { minPrice: parseFloat(filters.minPrice) });
    }

    if (filters.maxPrice) {
      query.andWhere('machinery.pricePerDay <= :maxPrice', { maxPrice: parseFloat(filters.maxPrice) });
    }

    if (filters.ownerId) {
      query.andWhere('machinery.ownerId = :ownerId', { ownerId: filters.ownerId });
    }

    query.orderBy('machinery.createdAt', 'DESC');

    const results = await query.getMany();
    return results.map(item => this.transformLocation(item));
  }

  async findOne(id: string): Promise<any> {
    const machinery = await this.machineryRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!machinery) {
      throw new NotFoundException('Maquinaria no encontrada');
    }
    if (machinery.owner) {
      delete (machinery.owner as any).passwordHash;
    }
    return this.transformLocation(machinery);
  }

  async updateStatus(id: string, status: 'disponible' | 'alquilada' | 'mantenimiento'): Promise<any> {
    const machinery = await this.machineryRepository.findOne({ where: { id } });
    if (!machinery) {
      throw new NotFoundException('Maquinaria no encontrada');
    }
    machinery.status = status;
    const saved = await this.machineryRepository.save(machinery);
    return this.transformLocation(saved);
  }

  async remove(id: string): Promise<void> {
    const machinery = await this.machineryRepository.findOne({ where: { id } });
    if (!machinery) {
      throw new NotFoundException('Maquinaria no encontrada');
    }
    await this.machineryRepository.remove(machinery);
  }
}

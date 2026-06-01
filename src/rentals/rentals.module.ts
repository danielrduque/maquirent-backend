import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalRequest } from './entities/rental.entity';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { MachineryModule } from '../machinery/machinery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalRequest]),
    MachineryModule,
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
})
export class RentalsModule {}

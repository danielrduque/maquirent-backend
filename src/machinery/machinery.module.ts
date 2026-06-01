import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Machinery } from './entities/machinery.entity';
import { MachineryService } from './machinery.service';
import { MachineryController } from './machinery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Machinery])],
  providers: [MachineryService],
  controllers: [MachineryController],
  exports: [MachineryService],
})
export class MachineryModule {}

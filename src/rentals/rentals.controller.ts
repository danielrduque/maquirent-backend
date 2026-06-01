import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.rentalsService.create(body, req.user.id);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.rentalsService.findAll(req.user.id, req.user.role);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.rentalsService.updateStatus(id, status, req.user.id);
  }
}

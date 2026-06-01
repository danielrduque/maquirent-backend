import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { MachineryService } from './machinery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('machinery')
export class MachineryController {
  constructor(private readonly machineryService: MachineryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any, @Request() req: any) {
    return this.machineryService.create(body, req.user.id);
  }

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('municipality') municipality?: string,
    @Query('status') status?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('ownerId') ownerId?: string,
  ) {
    return this.machineryService.findAll({
      category,
      municipality,
      status,
      minPrice,
      maxPrice,
      ownerId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.machineryService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.machineryService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    await this.machineryService.remove(id);
    return { success: true };
  }
}

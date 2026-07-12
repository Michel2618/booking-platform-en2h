import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';
import { ApiBody } from '@nestjs/swagger'; 

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id/status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'CONFIRMED'
        }
      }
    }
  })
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: BookingStatus
  ) {
    return this.bookingsService.updateStatus(+id, status);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(+id);
  }
}
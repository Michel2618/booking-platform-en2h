import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    // Rule 1: Check if the service exists
    const service = await this.prisma.service.findUnique({
      where: { id: createBookingDto.serviceId },
    });
    if (!service) {
      throw new NotFoundException('The requested service does not exist.');
    }

    // Rule 2: Booking dates cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(createBookingDto.bookingDate);
    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past.');
    }

    // Extra Credit: Prevent duplicate bookings for same service, date, and time
    const duplicate = await this.prisma.booking.findFirst({
      where: {
        serviceId: createBookingDto.serviceId,
        bookingDate: bookingDate,
        bookingTime: createBookingDto.bookingTime,
        status: { not: BookingStatus.CANCELLED },
      },
    });
    if (duplicate) {
      throw new BadRequestException('This slot is already booked for this service.');
    }

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        bookingDate: bookingDate, // Save it as a proper Date object
        status: BookingStatus.PENDING,
      },
    });
  }

  findAll() {
    return this.prisma.booking.findMany({ include: { service: true } });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!booking) throw new NotFoundException('Booking not found.');
    return booking;
  }

  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.findOne(id);

    // Rule 3: Cancelled bookings cannot be marked as completed
    if (booking.status === BookingStatus.CANCELLED && status === BookingStatus.COMPLETED) {
      throw new BadRequestException('A cancelled booking cannot be marked as completed.');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async cancel(id: number) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
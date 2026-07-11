export class CreateBookingDto {
  customerName!: string;
  customerEmail!: string;
  customerPhone!: string;
  serviceId!: number;
  bookingDate!: string; 
  bookingTime!: string; 
  notes?: string;
}
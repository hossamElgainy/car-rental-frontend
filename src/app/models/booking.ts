// src/app/models/booking.model.ts
export interface CarBooking {
  id?: string;
  carId: string;
  carName?: string;
  quentity: number;
}

export interface Booking {
  id?: string;
  bookedAt?: Date;
  customerName: string;
  customerNationality: string;
  customerDrivingLicense: string;
  payment: string;
  from: Date;
  to: Date;
  carBookings: CarBooking[];
}

export interface BookingListResponse {
  items: Booking[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
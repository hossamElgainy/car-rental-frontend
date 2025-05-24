import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Car } from '../../../models/car';
import { Booking, CarBooking } from '../../../models/booking';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-booking-form',
  imports: [CommonModule, FormsModule],

  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  nationalities: string[] = []; 
  isLoadingNationalities = false;
  selectedCars: Car[] = [];
  booking: Booking = {
    customerName: '',
    customerNationality: '',
    customerDrivingLicense: '',
    payment: '',
    from: new Date(),
    to: new Date(),
    carBookings: [] as CarBooking[]
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router, 
    private bookingService: BookingService
  ) { }
  validateQuantity(item: CarBooking): void {
    if (item.quentity < 1) {
      item.quentity = 1;
    }
  }

  isFormValid(): boolean {
    return (
      this.booking.customerName.trim() !== '' &&
      this.booking.customerNationality.trim() !== '' &&
      this.booking.customerDrivingLicense.trim() !== '' &&
      this.booking.payment.trim() !== '' &&
      this.booking.from &&
      this.booking.to &&
      this.booking.carBookings.every(item => item.quentity >= 1)
    );
  }
loadNationalities(): void {
  this.isLoadingNationalities = true;
  this.bookingService.loadNationalities().subscribe({
    next: (response) => {
      console.log('Nationalities loaded:', response);
             this.nationalities = response

      this.isLoadingNationalities = false;
    },
    error: (err) => {
      console.error('Failed to load nationalities', err);
      this.nationalities = [];
      this.isLoadingNationalities = false;
    }
  });
}
  ngOnInit(): void {
    this.loadNationalities();
    const state = history.state;
    this.selectedCars = state.selectedCars || [];

    if (this.selectedCars.length === 0) {
      this.router.navigate(['/cars']);
    }

    this.booking.carBookings = this.selectedCars.map(car => ({
      carId: car.id,
      carName: `${car.brand} ${car.modelName}`,
      quentity: 1 
    }));
  }

submitBooking(): void {
    const createBookingDto = {
      from: new Date(this.booking.from),
      to: new Date(this.booking.to),
      customerName: this.booking.customerName,
      customerNationality: this.booking.customerNationality,
      customerDrivingLicense: this.booking.customerDrivingLicense,
      payment: this.booking.payment,
      cars: this.booking.carBookings.map(car => ({
        carId: car.carId,
        quentity: car.quentity  
      }))
    };
    this.bookingService.createOrUpdateBooking(createBookingDto).subscribe({
      next: (response) => {
        alert('Booking created successfully!');
        this.router.navigate(['/bookings']);
      },
      error: (response) => {
        const errorMsg = response?.error?.message || response?.error || 'Unknown error';
      console.error('Booking failed', errorMsg);
      alert('Booking failed: ' + errorMsg);
      }
    });
  }  
}
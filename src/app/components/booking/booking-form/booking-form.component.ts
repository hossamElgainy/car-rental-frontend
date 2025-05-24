// src/app/components/booking/booking-form/booking-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Booking, CarBooking } from '../../../models/booking';
import { BookingService } from '../../../services/booking.service';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../models/car';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-booking-form',
   imports: [
   CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    MatButtonModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  cars: Car[] = [];
  nationalities: string[] = []; // Initialize as empty array
  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private carService: CarService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      id: [null],
      customerName: ['', Validators.required],
      customerNationality: ['', Validators.required],
      customerDrivingLicense: ['', Validators.required],
      payment: ['', Validators.required],
      from: ['', Validators.required],
      to: ['', Validators.required],
      carBookings: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadCars();
    this.addCarBooking();
      this.loadNationalities(); 

  }
 loadNationalities(): void {
    this.bookingService.loadNationalities().subscribe({
      next: (res) => {
        if (res.status && Array.isArray(res.data)) {
          this.nationalities = res.data;
        } else {
          this.toastr.warning('Unexpected response format for nationalities');
          this.setDefaultNationalities();
        }
      },
      error: (err) => {
        console.error('Failed to load nationalities', err);
        //this.toastr.error('Failed to load nationalities');
        this.setDefaultNationalities();
      }
    });
  }

  private setDefaultNationalities(): void {
    this.nationalities = ['Egyptian', 'American', 'British', 'French', 'German', 'Other'];
  }
  get carBookings(): FormArray {
    return this.bookingForm.get('carBookings') as FormArray;
  }

  loadCars(): void {
    this.carService.getAllCars().subscribe(response => {
      this.cars = response.items;
    });
  }

  addCarBooking(): void {
    const carBookingGroup = this.fb.group({
      carId: ['', Validators.required],
      quentity: [1, [Validators.required, Validators.min(1)]]
    });

    this.carBookings.push(carBookingGroup);
  }

  removeCarBooking(index: number): void {
    this.carBookings.removeAt(index);
  }

  getCarName(carId: string): string {
    const car = this.cars.find(c => c.id === carId);
    return car ? car.modelName : '';
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const booking: Booking = this.bookingForm.value;
      
      // Map car bookings to include car names
      booking.carBookings = booking.carBookings.map(cb => ({
        ...cb,
        carName: this.getCarName(cb.carId)
      }));

      this.bookingService.createOrUpdateBooking(booking).subscribe({
        next: () => {
          this.toastr.success('Booking saved successfully');
          this.router.navigate(['/bookings']);
        },
        error: (err) => {
          this.toastr.error('Error saving booking');
          console.error(err);
        }
      });
    } else {
      this.toastr.warning('Please fill all required fields');
    }
  }
}
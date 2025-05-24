// src/app/components/booking/booking-details/booking-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../../models/booking';
import { BookingService } from '../../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-booking-details',
  imports: [
    CommonModule,
    DatePipe,
    FormsModule
  ],  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBooking(id);
    }
  }

  loadBooking(id: string): void {
    this.isLoading = true;
    this.bookingService.getAllBookings('', '', null, null, null, 1, 1)
      .subscribe(response => {
        if (response.items.length > 0) {
          this.booking = response.items[0];
        }
        this.isLoading = false;
      });
  }
}
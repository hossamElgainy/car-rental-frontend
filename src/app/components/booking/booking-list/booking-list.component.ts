// Example for booking-list.component.ts
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../../models/booking';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { LocaleService } from 'ngx-daterangepicker-material';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    DatePipe
  ],
    providers: [LocaleService],
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',

  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  displayedColumns: string[] = ['bookedAt', 'customerName', 'customerNationality', 'from', 'to', 'actions'];
  dataSource = new MatTableDataSource<Booking>();
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  
  modelNameFilter = '';
  customerNameFilter = '';
  fromFilter: Date | null = null;
  toFilter: Date | null = null;
  bookedAtFilter: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getAllBookings(
      this.modelNameFilter,
      this.customerNameFilter,
      this.fromFilter,
      this.toFilter,
      this.bookedAtFilter,
      this.pageSize,
      this.pageIndex + 1
    ).subscribe((response: { items: Booking[]; totalCount: number; }) => {
      this.dataSource.data = response.items;
      this.totalCount = response.totalCount;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadBookings();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadBookings();
  }

  clearFilters(): void {
    this.modelNameFilter = '';
    this.customerNameFilter = '';
    this.fromFilter = null;
    this.toFilter = null;
    this.bookedAtFilter = null;
    this.applyFilters();
  }

  viewDetails(bookingId: string): void {
    this.router.navigate(['/bookings', bookingId]);
  }

  createNew(): void {
    this.router.navigate(['/bookings/new']);
  }
}
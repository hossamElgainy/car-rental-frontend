// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingListResponse, CarBooking } from '../models/booking';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/Booking`;
  nationalities: string[] = [];

  constructor(private http: HttpClient) { }
  loadNationalities(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/Countries/Countries`);
  }
  getAllBookings(
    modelName: string = '',
    customerName: string = '',
    from: Date | null = null,
    to: Date | null = null,
    bookedAt: Date | null = null,
    pageSize: number = 10,
    pageIndex: number = 1
  ): Observable<BookingListResponse> {
    let params = new HttpParams()
      .set('PageSize', pageSize.toString())
      .set('PageIndex', pageIndex.toString());

    if (modelName) {
      params = params.set('ModelName', modelName);
    }

    if (customerName) {
      params = params.set('CustomerName', customerName);
    }

    if (from) {
      params = params.set('From', from.toISOString());
    }

    if (to) {
      params = params.set('To', to.toISOString());
    }

    if (bookedAt) {
      params = params.set('BookedAt', bookedAt.toISOString());
    }

    return this.http.get<BookingListResponse>(`${this.apiUrl}/GetAll`, { params });
  }

  createOrUpdateBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/AddOrEditNewBooking`, booking);
  }
}
// src/app/services/car.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car, CarListResponse } from '../models/car';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/api/Cars`;

  constructor(private http: HttpClient) { }

  getAllCars(
    modelName: string = '',
    brandId: string = '',
    modelYear: number | null = null,
    pageSize: number = 10,
    pageIndex: number = 1
  ): Observable<CarListResponse> {
    let params = new HttpParams()
      .set('ModelName', modelName)
      .set('PageSize', pageSize.toString())
      .set('PageIndex', pageIndex.toString());

    if (brandId) {
      params = params.set('BrandId', brandId);
    }

    if (modelYear) {
      params = params.set('ModelYear', modelYear.toString());
    }

    return this.http.get<CarListResponse>(`${this.apiUrl}/GetAll`, { params });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BrandsResponse } from '../models/brand';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  constructor(private http: HttpClient) { }

  getAllBrands(): Observable<BrandsResponse> {
    return this.http.get<BrandsResponse>(`${environment.apiUrl}/api/Brands`);
  }
}
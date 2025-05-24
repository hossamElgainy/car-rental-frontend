// src/app/components/car/car-list/car-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Car, CarListResponse } from '../../../models/car';
import { CarService } from '../../../services/car.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-car-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
  
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  displayedColumns: string[] = ['modelName', 'brand', 'modelType', 'modelYear', 'power', 'availableCount'];
  dataSource = new MatTableDataSource<Car>();
  brands: Brand[] = [];
  isLoadingBrands = false;
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  
  modelNameFilter = '';
  selectedBrandId = ''; 
  modelYearFilter: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private carService: CarService,private brandService: BrandService) { }

  ngOnInit(): void {
    this.loadCars();
    this.loadBrands();
  }
loadBrands(): void {
    this.isLoadingBrands = true;
    this.brandService.getAllBrands().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.brands = response.data;
        }
        this.isLoadingBrands = false;
      },
      error: (err) => {
        console.error('Failed to load brands', err);
        this.isLoadingBrands = false;
      }
    });
  }
  loadCars(): void {
    this.carService.getAllCars(
      this.modelNameFilter,
      this.selectedBrandId, // Changed from brandIdFilter
      this.modelYearFilter,
      this.pageSize,
      this.pageIndex + 1
    ).subscribe(response => {
      this.dataSource.data = response.items;
      this.totalCount = response.totalCount;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadCars();
  }

  applyFilters(): void {
    this.pageIndex = 0;
    this.loadCars();
  }

  clearFilters(): void {
    this.modelNameFilter = '';
    this.selectedBrandId = '';
    this.modelYearFilter = null;
    this.applyFilters();
  }
}
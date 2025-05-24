import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Car, CarListResponse } from '../../../models/car';
import { CarService } from '../../../services/car.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  displayedColumns: string[] = ['modelName', 'brand', 'modelType', 'modelYear', 'power', 'availableCount'];
  displayedColumnsWithSelect = ['select', ...this.displayedColumns];
  
  dataSource = new MatTableDataSource<Car & {selected?: boolean}>([]); 
  selectedCars: Car[] = [];
  brands: Brand[] = [];
  isLoadingBrands = false;
  isLoading = false;
  
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  
  modelNameFilter = '';
  selectedBrandId = '';
  modelYearFilter: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private carService: CarService,
    private brandService: BrandService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

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
    this.isLoading = true;
    this.carService.getAllCars(
      this.modelNameFilter,
      this.selectedBrandId,
      this.modelYearFilter,
      this.pageSize,
      this.pageIndex + 1
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.items.map(car => ({
          ...car,
          selected: false
        }));
        this.totalCount = response.totalCount;
        this.updateSelectedCars();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load cars', err);
        this.isLoading = false;
      }
    });
  }

  toggleCarSelection(car: Car & {selected?: boolean}): void {
    if (car.availableCount === 0) return;
    car.selected = !car.selected;
    this.updateSelectedCars();
  }

  toggleAllSelection(event: MatCheckboxChange): void {
    const isChecked = event.checked;
    this.dataSource.data.forEach(car => {
      if (car.availableCount > 0) {
        car.selected = isChecked;
      }
    });
    this.updateSelectedCars();
  }

  updateSelectedCars(): void {
    this.selectedCars = this.dataSource.data.filter(car => car.selected && car.availableCount > 0);
    this.cdr.detectChanges();
  }

  allSelected(): boolean {
    const availableCars = this.dataSource.data.filter(car => car.availableCount > 0);
    return availableCars.length > 0 && 
           availableCars.every(car => car.selected);
  }

  someSelected(): boolean {
    const availableCars = this.dataSource.data.filter(car => car.availableCount > 0);
    return availableCars.some(car => car.selected) && 
           !this.allSelected();
  }

  bookSelectedCars(): void {
    if (this.selectedCars.length === 0) {
      alert('Please select at least one available car');
      return;
    }
    this.router.navigate(['/bookings/new'], {
      state: { selectedCars: this.selectedCars }
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

  trackByCarId(index: number, car: Car): string {
    return car.id;
  }
}
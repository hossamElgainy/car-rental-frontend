// src/app/models/car.model.ts
export interface Car {
  id: string;
  modelName: string;
  modelType: string;
  modelYear: string;
  brand: string;
  power: number;
  totalCount: number;
  availableCount: number;
}

export interface CarListResponse {
  items: Car[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
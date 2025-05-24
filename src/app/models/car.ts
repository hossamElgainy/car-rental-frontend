
export interface Car {
  id: string;
  modelName: string;
  modelType: string;
  modelYear: string;
  brand: string;
  power: number;
  totalCount: number;
  availableCount: number;
  selected?: boolean;
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
export interface Brand {
  id: string;
  name: string;
}

export interface BrandsResponse {
  status: boolean;
  message: string;
  error: string;
  data: Brand[];
}
import { z } from "zod";

import {
  SignInSchema,
  SignUpSchema,
  UpsertProductSchema,
} from "@/utils/schemas";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface ApiMetadata {
  current_page: number;
  page_size: number;
  first_page: number;
  last_page: number;
  total_records: number;
}

export interface User {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  activated: boolean;
}

export interface Product {
  id: number;
  created_at: string;
  name: string;
  code: string;
  version: number;
}

export type RegisterUserParams = z.infer<typeof SignUpSchema>;
export interface RegisterUserResponse extends User {}

export type LoginUserParams = z.infer<typeof SignInSchema>;

export type FetchCurrentUserResponse = {
  user: User;
};

export type FetchProductsParams = {
  name: string;
  page: number;
};
export type FetchProductsResponse = {
  metadata: ApiMetadata;
  products: Product[];
};

export type FetchProductByIdParams = number;
export type FetchProductByIdResponse = {
  product: Product;
};

export type CreateProductParams = z.infer<typeof UpsertProductSchema>;
export interface CreateProductResponse extends Product {}

export type UpdateProductParams = z.infer<typeof UpsertProductSchema> & {
  id: number;
};
export interface UpdateProductResponse extends Product {}

export type DeleteProductByIdParams = number;
export type DeleteProductByIdResponse = {
  message: string;
};

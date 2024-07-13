"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { COOKIE_TOKEN, DEFAULT_PAGE_SIZE } from "@/constants";
import {
  ApiResponse,
  CreateProductParams,
  CreateProductResponse,
  DeleteProductByIdParams,
  DeleteProductByIdResponse,
  FetchProductByIdParams,
  FetchProductByIdResponse,
  FetchProductsParams,
  FetchProductsResponse,
  UpdateProductParams,
  UpdateProductResponse,
} from "@/types/api";
import { handleHttpErrorResponse, handleHttpResponse } from "@/utils/api";

export const fetchProducts = async (
  params: FetchProductsParams,
): Promise<ApiResponse<FetchProductsResponse>> => {
  const token = cookies().get(COOKIE_TOKEN)?.value;

  const { name, page } = params;
  const queryParams = new URLSearchParams({
    name,
    page: `${page}`,
    page_size: DEFAULT_PAGE_SIZE,
  });

  try {
    const response = await fetch(
      `${process.env.API_URL}/v1/products?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return handleHttpResponse(response);
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const fetchProductById = async (
  id: FetchProductByIdParams,
): Promise<ApiResponse<FetchProductByIdResponse>> => {
  const token = cookies().get(COOKIE_TOKEN)?.value;

  try {
    const response = await fetch(`${process.env.API_URL}/v1/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleHttpResponse(response);
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const createProduct = async (
  product: CreateProductParams,
): Promise<ApiResponse<CreateProductResponse>> => {
  const token = cookies().get(COOKIE_TOKEN)?.value;
  const body = JSON.stringify({
    code: product.code,
    name: product.name,
  });

  try {
    const response = await fetch(`${process.env.API_URL}/v1/products`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return handleHttpResponse(response, "/products");
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const updateProduct = async (
  product: UpdateProductParams,
): Promise<ApiResponse<UpdateProductResponse>> => {
  const token = cookies().get(COOKIE_TOKEN)?.value;
  const body = JSON.stringify({
    code: product.code,
    name: product.name,
  });

  try {
    const response = await fetch(
      `${process.env.API_URL}/v1/products/${product.id}`,
      {
        method: "PATCH",
        body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return handleHttpResponse(response, "/products");
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const deleteProduct = async (
  id: DeleteProductByIdParams,
): Promise<ApiResponse<DeleteProductByIdResponse>> => {
  const token = cookies().get(COOKIE_TOKEN)?.value;

  try {
    const response = await fetch(`${process.env.API_URL}/v1/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleHttpResponse(response, "/products");
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

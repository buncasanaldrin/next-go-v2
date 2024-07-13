"use server";

import { revalidatePath } from "next/cache";

import { ApiResponse } from "@/types/api";
import { STATUS_INTERNAL_SERVER_ERROR } from "@/constants";

export const handleHttpResponse = async <T>(
  response: Response,
  path?: string,
): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const jsonResponse = await response.json();
    let errorMessages: string;

    if (typeof jsonResponse.error === "string") {
      errorMessages = jsonResponse.error;
    } else if (typeof jsonResponse.error === "object") {
      errorMessages = Object.values(jsonResponse.error).join(" ");
    } else {
      errorMessages = "An unexpected error occurred";
    }

    return {
      error: errorMessages,
      data: null,
      status: response.status,
    };
  }

  if (path) revalidatePath(path);

  const data: T = await response.json();

  return {
    error: null,
    data,
    status: response.status,
  };
};

export const handleHttpErrorResponse = async (error: unknown) => {
  console.error(error);

  if (error instanceof Error) {
    return {
      data: null,
      error: error.message,
      status: STATUS_INTERNAL_SERVER_ERROR,
    };
  }

  return {
    data: null,
    error: "An unexpected error occurred",
    status: STATUS_INTERNAL_SERVER_ERROR,
  };
};

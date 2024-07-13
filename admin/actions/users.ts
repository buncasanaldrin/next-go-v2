"use server";

import { cookies } from "next/headers";

import {
  ApiResponse,
  FetchCurrentUserResponse,
  LoginUserParams,
  RegisterUserParams,
  RegisterUserResponse,
} from "@/types/api";
import { handleHttpErrorResponse, handleHttpResponse } from "@/utils/api";
import { COOKIE_TOKEN } from "@/constants";

export const registerUser = async (
  user: RegisterUserParams,
): Promise<ApiResponse<RegisterUserResponse>> => {
  const body = JSON.stringify({
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
  });

  try {
    const response = await fetch(`${process.env.API_URL}/v1/users`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleHttpResponse(response);
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const fetchCurrentUser = async (): Promise<
  ApiResponse<FetchCurrentUserResponse>
> => {
  const token = cookies().get(COOKIE_TOKEN)?.value;

  try {
    const response = await fetch(`${process.env.API_URL}/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleHttpResponse(response);
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const loginUser = async (user: LoginUserParams) => {
  const body = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  try {
    const response = await fetch(
      `${process.env.API_URL}/v1/tokens/authentication`,
      {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const { authentication_token } = await response.json();
      const expiryDate = new Date(authentication_token.expiry);
      const maxAge = expiryDate.getTime();

      cookies().set(COOKIE_TOKEN, authentication_token.token, {
        maxAge,
        secure: true,
      });

      return { data: null, error: null };
    } else {
      return { data: null, error: "Invalid email or password" };
    }
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

export const logoutUser = async () => {
  const token = cookies().get(COOKIE_TOKEN)?.value;

  try {
    const response = await fetch(
      `${process.env.API_URL}/v1/tokens/authentication`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    cookies().delete(COOKIE_TOKEN);

    return handleHttpResponse(response);
  } catch (error: unknown) {
    return handleHttpErrorResponse(error);
  }
};

import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE_TOKEN } from "@/constants";
import { fetchCurrentUser } from "@/actions/users";

export const getCurrentUser = cache(async () => {
  const token = cookies().has(COOKIE_TOKEN);
  if (!token) redirect("/sign-in");

  const user = await fetchCurrentUser();

  return user?.data;
});

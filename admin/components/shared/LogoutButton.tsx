"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/actions/users";
import { useRouter } from "next/navigation";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/sign-in");
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;

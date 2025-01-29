"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/sign-in");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // Optionally show a loader while redirecting
  }

  return <>{children}</>;
};

export default PrivateRoute;

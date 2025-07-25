"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user-context";
import Agent from "./agent";
import Landlord from "./landlord";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.userType !== "Agent" && user.userType !== "Landowners") {
      router.push("/");
      return;
    }

  }, [user, router]);

  if (!user) return null;

  return (
    <>
      {user.userType === "Agent" && <Agent />}
      {user.userType === "Landowners" && <Landlord />}
    </>
  );
}

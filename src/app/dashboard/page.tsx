"use client";

import { useUserContext } from "@/context/user-context";
import Agent from "./agent";
import Landlord from "./landlord";

export default function Dashboard() {
  const { user } = useUserContext();

  if (!user) return null;

  return (
    <>
      {user.userType === "Agent" && <Agent />}
      {user.userType === "Landowners" && <Landlord />}
    </>
  );
}

"use client";

import React, { useEffect } from "react";
import { useUserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading-component/loading";

const Dashboard = () => {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Redirect based on user type
    if (user.userType === "Landowners") {
      router.push("/landlord");
    } else if (user.userType === "Agent") {
      router.push("/agent/dashboard");
    } else {
      // For other user types, stay on general dashboard
      // You can customize this as needed
    }
  }, [user, router]);

  if (!user) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen p-8 bg-[#EEF1F1]">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-[#09391C] font-display mb-6">
          Welcome to your Dashboard
        </h1>

        <section className="bg-white p-6 rounded-xl shadow-sm max-w-md">
          <h2 className="text-xl font-semibold text-[#09391C] mb-4">
            User Information
          </h2>
          <ul className="space-y-2 text-[#5A5D63]">
            <li>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </li>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
            <li>
              <strong>User Type:</strong> {user.userType}
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;

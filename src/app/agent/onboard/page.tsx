/** @format */
"use client";

import AgentOnboard from "@/components/agent-onboard/AgentOnboard";
import React, { useEffect } from "react";
import { useUserContext } from "@/context/user-context";
import { useRouter } from "next/navigation";

const OnboardPage = () => {
  const router = useRouter();
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;

    const isAgent = user.userType === "Agent";

    if (isAgent && user.agentData) {
      router.push("/agent/dashboard");
    } else if (!isAgent) {
      router.push("/dashboard");
    }
    // If agent without agentData — show the page (no redirect)
  }, [user]);

  if (!user) return null; // Or show a loader if you want

  const isAgentWithoutData = user.userType === "Agent" && !user.agentData;

  return isAgentWithoutData ? <AgentOnboard /> : null;
};

export default OnboardPage;

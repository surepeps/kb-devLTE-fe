/** @format */
"use client";

import AgentOnboard from "@/components/agent-onboard/AgentOnboard";
import React from "react";
import { useUserContext } from "@/context/user-context";

const OnboardPage = () => {
  const { user } = useUserContext();

  if (!user) return null;

  const isAgentWithoutData = user.userType === "Agent" && !user.agentData;

  return isAgentWithoutData ? <AgentOnboard /> : null;
};

export default OnboardPage;

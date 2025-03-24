
import React from "react";
import { toast } from "sonner";
import ClientStats from "./stats/ClientStats";
import CreatorStats from "./stats/CreatorStats";
import ManagerStats from "./stats/ManagerStats";
import AgentStats from "./stats/AgentStats";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

interface RoleStatsProps {
  role: string;
  userId?: string;
}

export const RoleStats = ({ role, userId }: RoleStatsProps) => {
  const { platformSettings } = usePlatformSettings(role || null);

  if (role === 'client') {
    return <ClientStats />;
  }

  if (role === 'creator') {
    return <CreatorStats userId={userId} />;
  }

  if (role === 'manager') {
    return <ManagerStats />;
  }

  if (role === 'agent') {
    return <AgentStats />;
  }

  return null;
};


import { useState, useEffect } from "react";
import { usePlatformSettings } from "@/hooks/use-platform-settings";
import { PlatformSettings } from "@/types/settings";

export const usePlatformData = () => {
  const { platformSettings } = usePlatformSettings();
  const rewardThreshold = 36000; // This could also come from platform settings if needed
  
  return {
    platformSettings,
    rewardThreshold
  };
};

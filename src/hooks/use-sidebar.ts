
import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from "@/hooks/use-media-query";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile) {
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  return {
    collapsed,
    isMobile,
    toggleSidebar
  };
}

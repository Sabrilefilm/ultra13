
import { ReactNode } from "react";

export interface NavigationItem {
  title: string;
  icon: ReactNode;
  href?: string;
  onClick?: (role?: string) => void;
  mobileFriendly?: boolean;
  children?: NavigationItem[];
  roles?: string[];
}

export interface UltraSidebarProps {
  username: string;
  role: string;
  userId?: string;
  onLogout: () => void;
  onAction?: (action: string, data?: any) => void;
  currentPage?: string;
  isMobileOpen?: boolean;
  setMobileMenuOpen?: (isOpen: boolean) => void;
  version?: string;
}

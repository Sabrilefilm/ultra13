
import { ReactElement } from "react";

export interface SidebarItem {
  icon: React.ElementType;
  label: string;
  action: string;
  data?: string;
  roles: string[];
  animated?: boolean;
}

export interface SidebarItemProps {
  item: SidebarItem;
  isActive: boolean;
  onClick: (action: string, data?: any) => void;
}

export interface SidebarNavigationProps {
  items: SidebarItem[];
  currentPage?: string;
  role: string;
  onClick: (action: string, data?: any) => void;
}

export interface SidebarUserProfileProps {
  username: string;
  role: string;
  collapsed: boolean;
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
}


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
  userId: string;
  onLogout: () => void;
  onAction?: (action: string, data?: any) => void;
  currentPage?: string;
  isMobileOpen?: boolean;
  setMobileMenuOpen?: (isOpen: boolean) => void;
  version?: string;
  children?: React.ReactNode;
  lastLogin?: string | null;
}

export interface SidebarUserProfileProps {
  username: string;
  role: string;
  collapsed: boolean;
}

export interface SidebarItem {
  icon: React.ComponentType<any>;
  label: string;
  action: string;
  data: string | ((role: string) => string);
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

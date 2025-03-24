
import React from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarItemCollapsed } from "./SidebarItemCollapsed";
import { SidebarNavigationProps } from "./types";

export const SidebarNavigation: React.FC<SidebarNavigationProps & { collapsed: boolean }> = ({ 
  items, 
  currentPage = 'dashboard', 
  role,
  onClick,
  collapsed
}) => {
  const filteredItems = items.filter(item => item.roles.includes(role));

  const isItemActive = (item: any) => {
    if (typeof item.data === 'function') {
      return currentPage === item.data(role);
    }
    return currentPage === item.data;
  };

  return (
    <nav className="space-y-1 px-2">
      {filteredItems.map(item => (
        collapsed ? (
          <SidebarItemCollapsed 
            key={item.label} 
            item={item}
            isActive={isItemActive(item)}
            onClick={onClick}
          />
        ) : (
          <SidebarItem 
            key={item.label} 
            item={item}
            isActive={isItemActive(item)}
            onClick={onClick}
          />
        )
      ))}
    </nav>
  );
};

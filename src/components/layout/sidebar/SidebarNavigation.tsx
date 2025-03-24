
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

  return (
    <nav className="space-y-1 px-2">
      {filteredItems.map(item => (
        collapsed ? (
          <SidebarItemCollapsed 
            key={item.label} 
            item={item}
            isActive={currentPage === item.data}
            onClick={onClick}
          />
        ) : (
          <SidebarItem 
            key={item.label} 
            item={item}
            isActive={currentPage === item.data}
            onClick={onClick}
          />
        )
      ))}
    </nav>
  );
};

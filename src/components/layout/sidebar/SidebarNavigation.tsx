
import React, { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { SidebarItemCollapsed } from "./SidebarItemCollapsed";
import { SidebarNavigationProps, SidebarItem as SidebarItemType } from "./types";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  items, 
  currentPage = 'dashboard', 
  role,
  onClick,
  collapsed = false
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  const filteredItems = items.filter(item => item.roles.includes(role));

  const isItemActive = (item: SidebarItemType): boolean => {
    // Si l'item a des enfants, vérifiez si l'un d'entre eux est actif
    if (item.children && item.children.length > 0) {
      return item.children.some(child => isItemActive(child));
    }

    if (typeof item.data === 'function') {
      const route = item.data(role);
      return currentPage === route || route === currentPage;
    }
    
    // Enlève le "/" initial pour la comparaison
    const itemPath = item.data.toString().replace(/^\//, '');
    const currentPagePath = currentPage.replace(/^\//, '');

    return itemPath === currentPagePath || 
           currentPagePath === itemPath || 
           (itemPath === '' && currentPagePath === 'dashboard');
  };

  const renderSubItems = (subItems: SidebarItemType[], parentLabel: string) => {
    const isExpanded = expandedItems.includes(parentLabel);

    if (!isExpanded) return null;

    return (
      <div className="pl-4 space-y-1 mt-1">
        {subItems.map(subItem => (
          <SidebarItem 
            key={subItem.label} 
            item={subItem}
            isActive={isItemActive(subItem)}
            onClick={onClick}
          />
        ))}
      </div>
    );
  };

  const renderItem = (item: SidebarItemType) => {
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    if (collapsed) {
      return (
        <div key={item.label}>
          <SidebarItemCollapsed 
            item={hasChildren ? {
              ...item,
              action: 'toggle',
              data: item.label
            } : item}
            isActive={isItemActive(item)}
            onClick={hasChildren ? () => toggleExpand(item.label) : onClick}
          />
        </div>
      );
    }

    if (hasChildren) {
      return (
        <div key={item.label} className="space-y-1">
          <Button 
            variant="ghost" 
            className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md 
              ${isItemActive(item) ? 'bg-blue-800 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}
            onClick={() => toggleExpand(item.label)}
          >
            <div className="flex items-center">
              <item.icon className="h-4 w-4 mr-2" />
              <span className="text-sm">{item.label}</span>
            </div>
            {isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
            }
          </Button>
          {renderSubItems(item.children, item.label)}
        </div>
      );
    }

    return (
      <SidebarItem 
        key={item.label} 
        item={item}
        isActive={isItemActive(item)}
        onClick={onClick}
      />
    );
  };

  return (
    <nav className="space-y-1 px-2">
      {filteredItems.map(item => renderItem(item))}
    </nav>
  );
};

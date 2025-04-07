
import React from "react";
import {
  Home,
  DollarSign,
  UserCog,
  Book,
  MessageCircle,
  PlaneTakeoff,
  Calendar,
  GraduationCap,
  FileText,
  User,
  Settings,
  Layout
} from "lucide-react";
import { NavigationItem } from "./types";

export const getNavigationItems = (role: string, currentPage: string): NavigationItem[] => {
  // Main top-level navigation items (visible first)
  const mainItems: NavigationItem[] = [
    {
      title: "Accueil",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Messagerie",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/messages",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Tournois",
      icon: <Calendar className="h-5 w-5" />,
      href: "/matches",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Formation",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/training",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Contrat",
      icon: <FileText className="h-5 w-5" />,
      href: "/contract",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Profil",
      icon: <User className="h-5 w-5" />,
      href: "/personal-info",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    }
  ];
  
  // All spaces unified under one dropdown
  const spacesItem: NavigationItem = {
    title: "Espaces",
    icon: <Layout className="h-5 w-5" />,
    mobileFriendly: false,
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"],
    children: []
  };
  
  // Add spaces based on role
  if (["founder", "manager", "agent"].includes(role)) {
    spacesItem.children?.push({
      title: "Gestion des utilisateurs",
      icon: <UserCog className="h-5 w-5" />,
      href: "/user-management",
      roles: ["founder", "manager", "agent"]
    });
    
    spacesItem.children?.push({
      title: "Statistiques créateurs",
      icon: <Settings className="h-5 w-5" />,
      href: "/creator-stats",
      roles: ["founder", "manager", "agent"]
    });
  }
  
  if (["founder", "manager"].includes(role)) {
    spacesItem.children?.push({
      title: "Horaires live",
      icon: <Calendar className="h-5 w-5" />,
      href: "/schedule",
      roles: ["founder", "manager"]
    });
  }
  
  if (role === "founder") {
    spacesItem.children?.push({
      title: "Import des données",
      icon: <Settings className="h-5 w-5" />,
      href: "/creator-import-dashboard",
      roles: ["founder"]
    });
  }
  
  if (["founder", "manager", "ambassadeur"].includes(role)) {
    spacesItem.children?.push({
      title: "Pénalités",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/penalties",
      roles: ["founder", "manager", "ambassadeur"]
    });
  }
  
  if (["founder", "ambassadeur"].includes(role)) {
    spacesItem.children?.push({
      title: "Espace ambassadeur",
      icon: <Settings className="h-5 w-5" />,
      href: "/ambassador-dashboard",
      roles: ["founder", "ambassadeur"]
    });
  }
  
  if (["founder", "manager"].includes(role)) {
    spacesItem.children?.push({
      title: "Espace manager",
      icon: <Settings className="h-5 w-5" />,
      href: "/manager-dashboard",
      roles: ["founder", "manager"]
    });
    
    spacesItem.children?.push({
      title: "Gestion d'agence",
      icon: <Settings className="h-5 w-5" />,
      href: "/agency-management",
      roles: ["founder", "manager"]
    });
  }
  
  if (["founder", "manager", "creator"].includes(role)) {
    spacesItem.children?.push({
      title: "Transfert",
      icon: <PlaneTakeoff className="h-5 w-5" />,
      href: "/transfers",
      roles: ["founder", "manager", "creator"]
    });
  }
  
  // Only add spaces item if it has children
  const items = [...mainItems];
  if (spacesItem.children && spacesItem.children.length > 0) {
    items.push(spacesItem);
  }
  
  return items;
};

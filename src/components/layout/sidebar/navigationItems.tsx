
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
  let items: NavigationItem[] = [];
  
  // Items accessibles par tous les rôles
  const commonItems: NavigationItem[] = [
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
      title: "Formation",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/training",
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
  
  // Espaces unifiés pour les différents rôles
  const allSpaces: NavigationItem = {
    title: "Espaces",
    icon: <Layout className="h-5 w-5" />,
    mobileFriendly: false,
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"],
    children: []
  };
  
  // Ajout des espaces spécifiques selon le rôle
  if (["founder", "manager", "agent"].includes(role)) {
    allSpaces.children?.push({
      title: "Gestion des utilisateurs",
      icon: <UserCog className="h-5 w-5" />,
      href: "/user-management",
      roles: ["founder", "manager", "agent"]
    });
  }
  
  if (["founder", "manager"].includes(role)) {
    allSpaces.children?.push({
      title: "Horaires live",
      icon: <Calendar className="h-5 w-5" />,
      href: "/schedule",
      roles: ["founder", "manager"]
    });
  }
  
  if (["founder", "manager", "agent"].includes(role)) {
    allSpaces.children?.push({
      title: "Statistiques créateurs",
      icon: <Settings className="h-5 w-5" />,
      href: "/creator-stats",
      roles: ["founder", "manager", "agent"]
    });
  }
  
  if (role === "founder") {
    allSpaces.children?.push({
      title: "Import des données",
      icon: <Settings className="h-5 w-5" />,
      href: "/creator-import-dashboard",
      roles: ["founder"]
    });
  }
  
  if (["founder", "manager", "ambassadeur"].includes(role)) {
    allSpaces.children?.push({
      title: "Pénalités",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/penalties",
      roles: ["founder", "manager", "ambassadeur"]
    });
  }
  
  if (["founder", "ambassadeur"].includes(role)) {
    allSpaces.children?.push({
      title: "Espace ambassadeur",
      icon: <Settings className="h-5 w-5" />,
      href: "/ambassador-dashboard",
      roles: ["founder", "ambassadeur"]
    });
  }
  
  if (["founder", "manager"].includes(role)) {
    allSpaces.children?.push({
      title: "Espace manager",
      icon: <Settings className="h-5 w-5" />,
      href: "/manager-dashboard",
      roles: ["founder", "manager"]
    });
    
    allSpaces.children?.push({
      title: "Gestion d'agence",
      icon: <Settings className="h-5 w-5" />,
      href: "/agency-management",
      roles: ["founder", "manager"]
    });
  }
  
  if (["founder", "manager", "creator"].includes(role)) {
    allSpaces.children?.push({
      title: "Transfert",
      icon: <PlaneTakeoff className="h-5 w-5" />,
      href: "/transfers",
      roles: ["founder", "manager", "creator"]
    });
  }
  
  // On n'ajoute l'élément Espaces que s'il a des enfants
  if (allSpaces.children && allSpaces.children.length > 0) {
    items.push(allSpaces);
  }
  
  // On ajoute les éléments communs
  items = [...items, ...commonItems];
  
  return items;
};

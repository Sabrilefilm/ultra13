
import React from "react";
import {
  Home,
  DollarSign,
  UserCog,
  Book,
  MessageCircle,
  PlaneTakeoff,
  Diamond,
  Calendar,
  GraduationCap,
  BarChart3,
  Award,
  FileSpreadsheet,
  UsersRound,
  CalendarRange,
  FileContract,
  User,
  Gift
} from "lucide-react";
import { NavigationItem } from "./types";

export const getNavigationItems = (role: string, currentPage: string): NavigationItem[] => {
  let items: NavigationItem[] = [];
  
  // Items accessible by all roles
  const commonItems: NavigationItem[] = [
    {
      title: "Accueil",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Règles internes",
      icon: <Book className="h-5 w-5" />,
      href: "/internal-rules",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Règles créateurs",
      icon: <Book className="h-5 w-5" />,
      href: "/creator-rules",
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
      icon: <CalendarRange className="h-5 w-5" />,
      href: "/matches",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Contrat",
      icon: <FileContract className="h-5 w-5" />,
      href: "/contract",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    },
    {
      title: "Informations personnelles",
      icon: <User className="h-5 w-5" />,
      href: "/personal-info",
      mobileFriendly: true,
      roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
    }
  ];
  
  // Items for founder role
  const founderItems: NavigationItem[] = [
    {
      title: "Gestion des utilisateurs",
      icon: <UserCog className="h-5 w-5" />,
      href: "/user-management",
      mobileFriendly: false,
      roles: ["founder", "manager", "agent"]
    },
    {
      title: "Pénalités",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/penalties",
      mobileFriendly: false,
      roles: ["founder", "manager", "ambassadeur"]
    },
    {
      title: "Horaires live",
      icon: <Calendar className="h-5 w-5" />,
      href: "/schedule",
      mobileFriendly: false,
      roles: ["founder", "manager"]
    },
    {
      title: "Statistiques créateurs",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/creator-stats",
      mobileFriendly: false,
      roles: ["founder", "manager", "agent"]
    },
    {
      title: "Import des données",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      href: "/creator-import-dashboard",
      mobileFriendly: false,
      roles: ["founder"]
    },
    {
      title: "Diamants créateurs",
      icon: <Diamond className="h-5 w-5" />,
      href: "/creator-diamonds",
      mobileFriendly: false,
      roles: ["founder", "manager", "agent"]
    },
    {
      title: "Espace ambassadeur",
      icon: <Award className="h-5 w-5" />,
      href: "/ambassador-dashboard",
      mobileFriendly: false,
      roles: ["founder", "ambassadeur"]
    },
    {
      title: "Espace manager",
      icon: <UsersRound className="h-5 w-5" />,
      href: "/manager-dashboard",
      mobileFriendly: false,
      roles: ["founder", "manager"]
    },
    {
      title: "Gestion d'agence",
      icon: <UsersRound className="h-5 w-5" />,
      href: "/agency-management",
      mobileFriendly: false,
      roles: ["founder", "manager"]
    },
    {
      title: "Récompenses créateurs",
      icon: <Gift className="h-5 w-5" />,
      href: "/creator-rewards",
      mobileFriendly: true,
      roles: ["founder", "manager", "creator", "ambassadeur"]
    },
    {
      title: "Gestion des récompenses",
      icon: <Gift className="h-5 w-5" />,
      href: "/rewards-management",
      mobileFriendly: false,
      roles: ["founder", "manager"]
    }
  ];
  
  // Items for creator role
  const creatorItems: NavigationItem[] = [
    {
      title: "Transfert",
      icon: <PlaneTakeoff className="h-5 w-5" />,
      href: "/transfers",
      mobileFriendly: true,
      roles: ["founder", "manager", "creator"]
    }
  ];
  
  // Add common items
  items = [...commonItems];
  
  // Add role-specific items
  if (role === "founder") {
    items = [...items, ...founderItems];
  }
  
  if (role === "manager") {
    items = [...items, ...founderItems.filter(item => item.roles.includes("manager"))];
  }
  
  if (role === "agent") {
    items = [...items, ...founderItems.filter(item => item.roles.includes("agent"))];
  }
  
  if (role === "creator") {
    items = [...items, ...creatorItems];
    items = [...items, ...founderItems.filter(item => item.roles.includes("creator"))];
  }
  
  if (role === "ambassadeur") {
    items = [...items, ...founderItems.filter(item => item.roles.includes("ambassadeur"))];
  }
  
  return items;
};

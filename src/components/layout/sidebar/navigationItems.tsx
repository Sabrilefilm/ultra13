
import { 
  Home, 
  Users, 
  Calendar, 
  Briefcase, 
  Award, 
  Bookmark, 
  MessageSquare, 
  Settings, 
  FileText, 
  Trophy, 
  Pen, 
  BookOpen,
  Diamond,
  FileSpreadsheet,
  BarChart2,
  UserPlus
} from "lucide-react";
import { SidebarItem } from "./types";

export const navigationItems: SidebarItem[] = [
  {
    icon: Home,
    label: "Tableau de bord",
    action: "navigateTo",
    data: "dashboard",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"],
    animated: true
  }, 
  {
    icon: BarChart2,
    label: "Espace Manager",
    action: "navigateTo",
    data: "manager-dashboard",
    roles: ["founder", "manager"],
    animated: true
  },
  {
    icon: Users,
    label: "Utilisateurs",
    action: "navigateTo",
    data: "user-management",
    roles: ["founder", "manager", "agent", "ambassadeur"]
  }, 
  {
    icon: Calendar,
    label: "Planning",
    action: "navigateTo",
    data: "schedule",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, 
  {
    icon: Trophy,
    label: "Matchs",
    action: "navigateTo",
    data: "matches",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, 
  {
    icon: Briefcase,
    label: "Transferts",
    action: "navigateTo",
    data: "transfers",
    roles: ["founder", "manager", "creator", "ambassadeur"]
  }, 
  {
    icon: Award,
    label: "Récompenses",
    action: "navigateTo",
    data: role => role === "creator" ? "creator-rewards" : "rewards-management",
    roles: ["founder", "manager", "creator"]
  },
  {
    icon: Diamond,
    label: "Diamants",
    action: "navigateTo",
    data: "creator-diamonds",
    roles: ["founder", "manager", "agent"]
  },
  {
    icon: MessageSquare,
    label: "Messagerie",
    action: "navigateTo",
    data: "messages",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"],
    animated: true
  }, 
  {
    icon: FileText,
    label: "Documents",
    action: "navigateTo",
    data: "documents",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, 
  {
    icon: Bookmark,
    label: "Sanctions",
    action: "navigateTo",
    data: "penalties",
    roles: ["founder", "manager", "ambassadeur"]
  }, 
  {
    icon: Settings,
    label: "Règles",
    action: "navigateTo",
    data: role => role === "creator" ? "creator-rules" : "internal-rules",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  }, 
  {
    icon: Pen,
    label: "Mes Créateurs",
    action: "navigateTo",
    data: "creator-stats",
    roles: ["agent", "manager", "founder", "ambassadeur"]
  },
  {
    icon: BookOpen,
    label: "Nos Formations",
    action: "navigateTo",
    data: "training",
    roles: ["founder", "manager", "agent", "creator", "ambassadeur"]
  },
  {
    icon: FileSpreadsheet,
    label: "Importation Excel",
    action: "navigateTo",
    data: "creator-import",
    roles: ["founder"]
  },
  {
    icon: UserPlus,
    label: "Espace Ambassadeur",
    action: "navigateTo",
    data: "ambassador",
    roles: ["founder", "ambassadeur"],
    animated: true
  }
];

export const getAmbassadorItems = (items: SidebarItem[]): SidebarItem[] => {
  return [...items];
};

export const getNavigationItems = (role: string | null, currentPage: string) => {
  return [...navigationItems];
};

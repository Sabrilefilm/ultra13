
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
  FileSpreadsheet,
  BarChart2,
  UserPlus,
  Key
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
    roles: ["founder", "manager"], // Only manager and founder can access
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
    icon: Trophy,
    label: "Matchs",
    action: "navigateTo",
    data: "matches",
    roles: ["founder", "manager"] // Only managers and founders can see matches
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
    roles: ["founder", "manager", "creator", "agent", "ambassadeur"]
  },
  {
    icon: Pen,
    label: "Mes Créateurs",
    action: "navigateTo",
    data: "creator-stats",
    roles: ["founder", "manager", "agent"] // Added manager and agent roles
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
  },
  {
    icon: Users,
    label: "Gestion Agence",
    action: "navigateTo",
    data: "agency-assignment",
    roles: ["founder", "manager"],
    animated: true
  }
];

export const getAmbassadorItems = (items: SidebarItem[]): SidebarItem[] => {
  return [...items];
};

export const getNavigationItems = (role: string | null, currentPage: string) => {
  return navigationItems.filter(item => item.roles.includes(role || ''));
};

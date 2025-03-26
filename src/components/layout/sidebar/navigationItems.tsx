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
  FileSpreadsheet
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
  }
];

export const getAmbassadorItems = (items: SidebarItem[]): SidebarItem[] => {
  const newItems = [...items];
  
  newItems.push({
    icon: Users,
    label: "Espace Ambassadeur",
    action: "navigateTo",
    data: "ambassador",
    roles: ["ambassadeur"],
    animated: true
  });
  
  return newItems;
};

export const getNavigationItems = (role: string | null, currentPage: string) => {
  const items = [...navigationItems];

  // Items spécifiques au rôle fondateur
  if (role === "founder") {
    items.push(
      {
        title: "Importation Excel",
        icon: <FileSpreadsheet size={16} />,
        href: "/creator-import",
        active: currentPage === "creator-import"
      }
    );
  }

  return items;
};

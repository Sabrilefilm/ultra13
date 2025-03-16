
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/ui/sidebar";
import {
  Calendar,
  User,
  Bell,
  FileText,
  Contact,
  AlertTriangle,
  Users,
  MessageSquare,
  Book,
  RefreshCw,
  UserCheck,
  ClipboardList,
  LayoutDashboard,
  Shield,
  Trophy
} from "lucide-react";

interface UltraSidebarProps {
  username: string;
  role: string;
  onLogout: () => void;
  currentPage: string;
}

export const UltraSidebar = ({
  username,
  role,
  onLogout,
  currentPage
}: UltraSidebarProps) => {
  const navigate = useNavigate();

  // Déterminer les liens en fonction du rôle
  const getNavLinks = () => {
    const links = [
      { 
        path: "/", 
        label: "Tableau de bord", 
        icon: <LayoutDashboard className="h-5 w-5" />, 
        id: "dashboard",
        roles: ["founder", "manager", "agent", "creator", "viewer"] 
      },
      { 
        path: "/matches", 
        label: "Matchs", 
        icon: <Trophy className="h-5 w-5" />, 
        id: "matches",
        roles: ["founder", "manager", "agent", "creator", "viewer"] 
      },
      { 
        path: "/schedule", 
        label: "Planning & Horaires", 
        icon: <Calendar className="h-5 w-5" />, 
        id: "schedule",
        roles: ["founder", "manager", "agent"] 
      },
      { 
        path: "/users", 
        label: "Gestion utilisateurs", 
        icon: <User className="h-5 w-5" />, 
        id: "users",
        roles: ["founder", "manager"] 
      },
      { 
        path: "/agency-assignment", 
        label: "Attribution agences", 
        icon: <UserCheck className="h-5 w-5" />, 
        id: "agency-assignment",
        roles: ["founder"] 
      },
      { 
        path: "/team", 
        label: "Équipe", 
        icon: <Users className="h-5 w-5" />, 
        id: "team",
        roles: ["founder", "manager"] 
      },
      { 
        path: "/transfers", 
        label: "Transferts", 
        icon: <RefreshCw className="h-5 w-5" />, 
        id: "transfers",
        roles: ["founder", "manager", "agent", "creator"] 
      },
      { 
        path: "/documents", 
        label: "Documents", 
        icon: <FileText className="h-5 w-5" />, 
        id: "documents",
        roles: ["founder", "manager", "agent", "creator"] 
      },
      { 
        path: "/notifications", 
        label: "Notifications", 
        icon: <Bell className="h-5 w-5" />, 
        id: "notifications",
        roles: ["founder", "manager"] 
      },
      { 
        path: "/internal-rules", 
        label: "Règlement interne", 
        icon: <Book className="h-5 w-5" />, 
        id: "internal-rules",
        roles: ["founder", "manager", "agent", "creator", "viewer"] 
      },
      { 
        path: "/penalties", 
        label: "Pénalités", 
        icon: <AlertTriangle className="h-5 w-5" />, 
        id: "penalties",
        roles: ["founder", "manager"] 
      },
      { 
        path: "/contact", 
        label: "Contact", 
        icon: <Contact className="h-5 w-5" />, 
        id: "contact",
        roles: ["founder", "manager", "agent", "creator", "viewer"] 
      },
      { 
        path: "/messages", 
        label: "Messages", 
        icon: <MessageSquare className="h-5 w-5" />, 
        id: "messages",
        roles: ["founder", "manager", "agent", "creator"] 
      },
      { 
        path: "/personal-information", 
        label: "Mes informations", 
        icon: <ClipboardList className="h-5 w-5" />, 
        id: "personal-information",
        roles: ["founder", "manager", "agent", "creator"] 
      }
    ];

    return links.filter(link => link.roles.includes(role));
  };

  return (
    <Sidebar 
      className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950" 
      closeOnSelect={false}
    >
      <div className="flex flex-col h-full p-4">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto">
          {getNavLinks().map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={currentPage === link.id ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${
                  currentPage === link.id
                    ? "bg-purple-100 text-purple-900 dark:bg-purple-900/20 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <div className="px-3 py-2 mb-2 rounded-md bg-gray-50 dark:bg-gray-900">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {role}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
            onClick={onLogout}
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </Sidebar>
  );
};

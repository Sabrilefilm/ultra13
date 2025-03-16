
import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Calendar,
  AlertTriangle,
  Users,
  Mail as MailIcon,
  Shield,
  Zap,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Rocket,
  Menu as MenuIcon,
  X as XIcon,
  MessageSquare,
  ScrollText,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { supabase } from "@/lib/supabase";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  badge?: number;
}

interface UltraSidebarProps {
  username: string;
  role: string;
  onLogout: () => void;
  onAction?: (action: string, data?: any) => void;
  currentPage?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  isExpanded,
  badge,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center p-2 rounded hover:bg-gray-800 transition-colors relative",
          isExpanded ? "justify-start" : "justify-center",
          isActive ? "bg-purple-700 text-white" : "text-gray-400"
        )
      }
    >
      {icon}
      <span
        className={cn(
          "ml-2 transition-opacity duration-200",
          isExpanded ? "opacity-100" : "opacity-0 w-0"
        )}
      >
        {label}
      </span>
      
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1 -translate-y-1 animate-pulse">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </NavLink>
  );
};

export const UltraSidebar = ({
  username,
  role,
  onLogout,
  onAction,
  currentPage = 'dashboard'
}: UltraSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const confirmLogout = () => {
    const confirm = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (confirm) {
      handleLogout();
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      if (onLogout) {
        onLogout();
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: "Une erreur s'est produite lors de la déconnexion.",
      });
    }
  };

  // Fetch unread message count
  useEffect(() => {
    if (!username) return;

    const fetchUnreadCount = async () => {
      try {
        const { data: userData } = await supabase.auth.getSession();
        if (!userData.session) return;

        const userId = userData.session.user.id;
        const { data, error, count } = await supabase
          .from("chats")
          .select("*", { count: "exact" })
          .eq("receiver_id", userId)
          .eq("read", false);

        if (error) throw error;
        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadCount();

    // Subscribe to realtime changes for new messages
    const channel = supabase
      .channel('public:chats')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chats'
      }, fetchUnreadCount)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'chats'
      }, fetchUnreadCount)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  return (
    <aside
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col bg-[#0e0e16] border-r border-gray-800/40 text-white transition-all duration-300",
        isExpanded ? "w-64" : "w-20",
        isMobile && !isExpanded ? "-translate-x-full" : "translate-x-0"
      )}
    >
      {isMobile && (
        <div
          className={cn(
            "fixed z-40 flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full shadow-lg cursor-pointer transition-all duration-200",
            isExpanded ? "left-60 top-4" : "left-4 top-4"
          )}
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <XIcon className="w-6 h-6 text-white" />
          ) : (
            <MenuIcon className="w-6 h-6 text-white" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800/40">
        <div className="flex items-center">
          <Rocket className="w-6 h-6 text-purple-400" />
          <span
            className={cn(
              "ml-2 font-bold transition-opacity duration-200",
              isExpanded ? "opacity-100" : "opacity-0"
            )}
          >
            ULTRA
          </span>
        </div>
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-800"
          >
            {isExpanded ? (
              <ChevronsLeft className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronsRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <nav className="space-y-2">
            <NavItem
              to="/"
              icon={<Home className="w-5 h-5" />}
              label="Tableau de bord"
              isExpanded={isExpanded}
            />
            <NavItem
              to="/personal-information"
              icon={<User className="w-5 h-5" />}
              label="Profil"
              isExpanded={isExpanded}
            />
            <NavItem
              to="/messages"
              icon={<MessageSquare className="w-5 h-5" />}
              label="Messages"
              isExpanded={isExpanded}
              badge={unreadCount}
            />
            <NavItem
              to="/penalties"
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Pénalités"
              isExpanded={isExpanded}
            />
            <NavItem
              to="/team"
              icon={<Users className="w-5 h-5" />}
              label="Équipe"
              isExpanded={isExpanded}
            />
            <NavItem
              to="/schedule"
              icon={<Calendar className="w-5 h-5" />}
              label="Planning"
              isExpanded={isExpanded}
            />
            <NavItem
              to="/internal-rules"
              icon={<ScrollText className="w-5 h-5" />}
              label="Règlement"
              isExpanded={isExpanded}
            />
            <NavItem
              to="/contact"
              icon={<MailIcon className="w-5 h-5" />}
              label="Contact"
              isExpanded={isExpanded}
            />
          </nav>

          {isExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-800/40">
              <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase">
                Administration
              </h3>
              <nav className="space-y-2">
                <NavItem
                  to="/users"
                  icon={<Shield className="w-5 h-5" />}
                  label="Gestion Utilisateurs"
                  isExpanded={isExpanded}
                />
                <NavItem
                  to="/external-matches"
                  icon={<Zap className="w-5 h-5" />}
                  label="Matchs Externes"
                  isExpanded={isExpanded}
                />
                <NavItem
                  to="/notifications"
                  icon={<Bell className="w-5 h-5" />}
                  label="Notifications"
                  isExpanded={isExpanded}
                />
              </nav>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-800/40">
        <button
          onClick={confirmLogout}
          className={cn(
            "flex items-center w-full p-2 rounded hover:bg-gray-800 transition-colors",
            isExpanded ? "justify-start" : "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          <span
            className={cn(
              "ml-2 text-gray-300 transition-opacity duration-200",
              isExpanded ? "opacity-100" : "opacity-0 w-0"
            )}
          >
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
};

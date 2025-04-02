
import React, { useState, useEffect } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";
import { Bell, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const NotificationManagement = () => {
  const { isAuthenticated, username, role, userId, handleLogout } = useIndexAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch notifications logic here
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // API call to fetch notifications
        // const { data } = await...
        
        // Mock data for now
        setNotifications([]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <UltraSidebar
        username={username}
        role={role}
        userId={userId || ''}
        onLogout={handleLogout}
        currentPage="notifications"
      >
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
          <div className="flex items-center mb-6">
            <BackButton className="mr-4" />
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Bell className="h-6 w-6 mr-2 text-purple-400" />
              Gestion des notifications
            </h1>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {/* Notification list */}
            </div>
          ) : (
            <Card className="bg-slate-800/90 border-purple-500/20 p-8 text-center">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-300">Aucune notification disponible.</p>
              </div>
            </Card>
          )}
        </div>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default NotificationManagement;

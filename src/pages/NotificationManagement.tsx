
import React, { useState, useEffect } from "react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";

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
        <div className="w-full max-w-6xl mx-auto p-6">
          <div className="flex items-center mb-6">
            <BackButton className="mr-4" />
            <h1 className="text-2xl font-bold mb-6">Gestion des notifications</h1>
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
            <div className="text-center p-8 bg-slate-800 rounded-lg">
              <p className="text-slate-300">Aucune notification disponible.</p>
            </div>
          )}
        </div>
      </UltraSidebar>
    </SidebarProvider>
  );
};

export default NotificationManagement;

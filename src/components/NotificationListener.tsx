
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Bell } from "lucide-react";

interface NotificationsListenerProps {
  userId?: string;
  role?: string;
}

export const NotificationsListener = ({ userId, role }: NotificationsListenerProps) => {
  const { toast } = useToast();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Fonction pour jouer le son de notification
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  };

  useEffect(() => {
    if (!userId && !role) return;

    // Fonction pour récupérer et afficher les dernières notifications
    const fetchRecentNotifications = async () => {
      try {
        console.log("Fetching notifications for user:", userId, "role:", role);
        
        // Construire la requête sans erreur de syntaxe UUID
        let query = supabase
          .from('notifications')
          .select('*')
          .order('sent_at', { ascending: false })
          .limit(5);
        
        // Ajouter des filtres de manière sûre (sans essayer de comparer directement des uuid)
        if (role) {
          query = query.or(`user_group.eq.all,user_group.eq.${role}`);
        }
        
        // Si userId existe, chercher aussi les notifications spécifiques à cet utilisateur
        // mais de façon distincte pour éviter les erreurs de syntaxe UUID
        const { data: notifications, error } = await query;

        if (error) {
          console.error("Error fetching notifications:", error);
          throw error;
        }

        if (notifications && notifications.length > 0) {
          // Afficher la notification la plus récente
          const latestNotification = notifications[0];
          
          toast({
            title: latestNotification.title,
            description: latestNotification.message,
            duration: 10000,
          });

          playNotificationSound();
          setHasUnreadNotifications(true);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
      }
    };

    // Récupérer les notifications récentes au chargement
    fetchRecentNotifications();

    // Écouter les nouvelles notifications en temps réel
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications' 
        }, 
        (payload) => {
          const newNotification = payload.new as any;
          
          // Vérifier si la notification est pour cet utilisateur ou son groupe
          if (
            newNotification.user_group === 'all' || 
            (role && newNotification.user_group === role)
          ) {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              duration: 10000,
            });
            
            playNotificationSound();
            setHasUnreadNotifications(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, role, toast]);

  return hasUnreadNotifications ? (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full text-white animate-pulse">
        <Bell className="w-4 h-4" />
      </div>
    </div>
  ) : null;
};

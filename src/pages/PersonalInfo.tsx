
import React, { useState, useEffect } from 'react';
import { PageLayout } from "@/components/layouts/PageLayout";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsCard } from "@/components/StatsCard";
import { Clock, Award, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from '@/lib/supabase';

const PersonalInfo = () => {
  const { username, role, lastLogin, userId } = useAuth();
  const [userStats, setUserStats] = useState({
    totalHours: 0,
    daysActive: 0,
    bestDay: 0,
    averageHours: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('total_live_hours, days_streamed')
          .eq('id', userId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setUserStats({
            totalHours: data.total_live_hours || 0,
            daysActive: data.days_streamed || 0,
            bestDay: Math.round((data.total_live_hours || 0) / Math.max(1, (data.days_streamed || 1)) * 1.5),
            averageHours: Math.round((data.total_live_hours || 0) / Math.max(1, (data.days_streamed || 1)) * 10) / 10
          });
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [userId]);

  const formattedLastLogin = lastLogin 
    ? new Date(lastLogin).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Jamais';

  return (
    <PageLayout title="Mon Profil">
      <div className="space-y-6">
        {/* User Profile Header */}
        <ProfileHeader 
          username={username}
          role={role}
          lastActive={formattedLastLogin}
          daysActive={userStats.daysActive}
        />
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Heures Totales" 
            value={`${userStats.totalHours}h`}
            icon={<Clock className="h-5 w-5 text-blue-400" />}
            className="bg-white/5 backdrop-blur-md border border-white/10 neo-shadow"
          />
          <StatsCard 
            title="Moyenne Quotidienne" 
            value={`${userStats.averageHours}h`}
            icon={<TrendingUp className="h-5 w-5 text-green-400" />}
            className="bg-white/5 backdrop-blur-md border border-white/10 neo-shadow"
          />
          <StatsCard 
            title="Meilleure Journée" 
            value={`${userStats.bestDay}h`}
            icon={<Award className="h-5 w-5 text-yellow-400" />}
            className="bg-white/5 backdrop-blur-md border border-white/10 neo-shadow"
          />
          <StatsCard 
            title="Jours Actifs" 
            value={userStats.daysActive.toString()}
            icon={<Calendar className="h-5 w-5 text-purple-400" />}
            className="bg-white/5 backdrop-blur-md border border-white/10 neo-shadow"
          />
        </div>
        
        {/* Profile Tabs */}
        <ProfileTabs />
      </div>
    </PageLayout>
  );
};

export default PersonalInfo;

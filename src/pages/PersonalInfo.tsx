
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
        <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="bg-purple-600 text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-lg">
                {username?.substring(0, 2) || "U"}
              </div>
              <div className="mt-2 text-center">
                <span className="bg-amber-600/20 text-amber-400 text-xs px-2 py-1 rounded-full">
                  {role || "Créateur"}
                </span>
              </div>
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{username || "Utilisateur"}</h2>
              <p className="text-slate-400 text-sm mt-1">@{username?.toLowerCase() || "username"}</p>
              
              <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">Dernière connexion: {formattedLastLogin}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span className="text-sm">{userStats.daysActive} jours actifs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Heures Totales" 
            value={`${userStats.totalHours}h`}
            icon={<Clock className="h-5 w-5 text-blue-400" />}
          />
          <StatsCard 
            title="Moyenne Quotidienne" 
            value={`${userStats.averageHours}h`}
            icon={<TrendingUp className="h-5 w-5 text-green-400" />}
          />
          <StatsCard 
            title="Meilleure Journée" 
            value={`${userStats.bestDay}h`}
            icon={<Award className="h-5 w-5 text-yellow-400" />}
          />
          <StatsCard 
            title="Jours Actifs" 
            value={userStats.daysActive.toString()}
            icon={<Calendar className="h-5 w-5 text-purple-400" />}
          />
        </div>
        
        {/* Profile Tabs */}
        <div className="bg-slate-800/90 border border-slate-700/50 rounded-lg shadow-lg p-4 md:p-6">
          <ProfileTabs />
        </div>
      </div>
    </PageLayout>
  );
};

export default PersonalInfo;

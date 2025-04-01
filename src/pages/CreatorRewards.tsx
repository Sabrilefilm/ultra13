
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RewardProgramTables } from "@/components/rewards/RewardProgramTables";

const CreatorRewards = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Récupérer l'information utilisateur depuis localStorage
    const storedUsername = localStorage.getItem('username') || '';
    const storedRole = localStorage.getItem('userRole') || '';
    const storedUserId = localStorage.getItem('userId') || '';
    
    setUsername(storedUsername);
    setRole(storedRole);
    setUserId(storedUserId);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isFounder = role === 'founder';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white flex">
        <UltraSidebar 
          username={username}
          role={role}
          userId={userId}
          onLogout={handleLogout}
          currentPage="recompenses"
        />
        
        <div className="flex-1 flex flex-col">
          <div className="py-4 px-6 border-b border-gray-800 bg-slate-800/50 flex items-center sticky top-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Programme de Récompenses</h1>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <RewardProgramTables canEdit={isFounder} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CreatorRewards;

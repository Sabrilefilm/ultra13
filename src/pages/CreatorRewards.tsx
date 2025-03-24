
import React from 'react';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { useNavigate } from 'react-router-dom';
import { Loading } from '@/components/ui/loading';
import { RewardsPanel } from '@/components/rewards/RewardsPanel';
import { RewardProgramTables } from '@/components/rewards/RewardProgramTables'; 

const CreatorRewards = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  
  if (!role || !username || !userId) {
    return <Loading fullScreen text="Chargement des informations utilisateur..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar
        username={username}
        role={role}
        userId={userId}
        onLogout={handleLogout}
        currentPage="creator-rewards"
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold">Gestion des Récompenses</h1>
          
          {/* Add the Reward Program Tables component */}
          <RewardProgramTables role={role} />
          
          <RewardsPanel />
        </div>
      </div>
    </div>
  );
};

export default CreatorRewards;

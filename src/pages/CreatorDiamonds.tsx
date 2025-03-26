import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, HomeIcon, RefreshCw } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiamondManagement } from '@/hooks/diamonds/use-diamond-management';
import { UserDiamondsTable } from '@/components/diamonds/UserDiamondsTable';
import { AgencyOverview } from '@/components/diamonds/AgencyOverview';
import { EditGoalDialog } from '@/components/diamonds/EditGoalDialog';
import { DiamondManagementDialog } from '@/components/diamonds/DiamondManagementDialog';
import { Creator } from '@/hooks/diamonds/use-diamond-fetch';

const CreatorDiamonds = () => {
  const navigate = useNavigate();
  const {
    loading,
    role,
    username,
    userId,
    searchQuery,
    isDialogOpen,
    setIsDialogOpen,
    selectedCreator,
    newDiamondGoal,
    setNewDiamondGoal,
    agencyGoal,
    setAgencyGoal,
    diamondValue,
    isEditing,
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    diamondAmount,
    setDiamondAmount,
    operationType,
    activeTab,
    setActiveTab,
    totalAgencyDiamonds,
    handleSearch,
    openEditDialog,
    openDiamondModal,
    handleUpdateDiamondGoal,
    handleUpdateDiamonds,
    handleUpdateAgencyGoal,
    fetchAllUsers,
    getActiveUsers
  } = useDiamondManagement();
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  
  if (loading) {
    return <Loading fullScreen size="large" text="Chargement des données diamants..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={handleLogout}
        currentPage="creator-diamonds"
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Gestion des Diamants</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <HomeIcon className="h-4 w-4" />
                Retour au tableau de bord
              </Button>
              <Button 
                variant="outline" 
                onClick={fetchAllUsers}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>
          
          <AgencyOverview
            totalAgencyDiamonds={totalAgencyDiamonds}
            agencyGoal={agencyGoal}
            diamondValue={diamondValue}
            role={role}
            setAgencyGoal={setAgencyGoal}
            handleUpdateAgencyGoal={handleUpdateAgencyGoal}
            isEditing={isEditing}
          />
          
          <Tabs defaultValue="creators" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="creators">Créateurs</TabsTrigger>
              <TabsTrigger value="managers">Managers</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'creators' && 'Diamants des Créateurs'}
                    {activeTab === 'managers' && 'Diamants des Managers'}
                    {activeTab === 'agents' && 'Diamants des Agents'}
                  </CardTitle>
                  <CardDescription>
                    Gérez les objectifs et les diamants pour chaque {activeTab === 'creators' ? 'créateur' : activeTab === 'managers' ? 'manager' : 'agent'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activeTab === 'creators' && (
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher un créateur..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                  
                  <UserDiamondsTable 
                    users={getActiveUsers() as Creator[]}
                    diamondValue={diamondValue}
                    role={role}
                    openEditDialog={openEditDialog}
                    openDiamondModal={openDiamondModal}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <EditGoalDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedCreator={selectedCreator as Creator}
        newDiamondGoal={newDiamondGoal}
        setNewDiamondGoal={setNewDiamondGoal}
        onSave={handleUpdateDiamondGoal}
        isEditing={isEditing}
      />
      
      <DiamondManagementDialog
        isOpen={isDiamondModalOpen}
        onOpenChange={setIsDiamondModalOpen}
        selectedCreator={selectedCreator as Creator}
        diamondAmount={diamondAmount}
        setDiamondAmount={setDiamondAmount}
        operationType={operationType}
        onSave={handleUpdateDiamonds}
        isEditing={isEditing}
      />
    </div>
  );
};

export default CreatorDiamonds;

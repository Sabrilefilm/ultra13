import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, UsersRound, FileSpreadsheet, HomeIcon } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { UserSearchBar } from "@/components/UserSearchBar";
import { CreatorDetailsDialog } from "@/components/creator/CreatorDetailsDialog";
import { UserTable } from "@/components/user-management/UserTable";
import { RoleConfirmDialog } from "@/components/user-management/RoleConfirmDialog";
import { useUserManagement } from "@/hooks/use-user-management";
import { CreateAccountModal } from "@/components/CreateAccountModal";
import { useAccountManagement } from "@/hooks/use-account-management";
import { ExcelImportButton } from "@/components/user-management/ExcelImportButton";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { ScheduleExcelImport } from "@/components/schedule/ScheduleExcelImport";
import { Footer } from "@/components/layout/Footer";

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, userId, handleLogout } = useIndexAuth();
  const { handleCreateAccount } = useAccountManagement();
  const {
    users,
    isLoading,
    selectedUser,
    setSelectedUser,
    creatorDetails,
    editingUser,
    editedUsername,
    setEditedUsername,
    searchQuery,
    setSearchQuery,
    showRoleConfirmDialog,
    setShowRoleConfirmDialog,
    pendingRoleChange,
    setPendingRoleChange,
    showPasswords,
    editingPassword,
    setEditingPassword,
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange,
    handleUsernameEdit,
    handleUsernameSave,
    handlePasswordEdit,
    handlePasswordSave,
    handleViewDetails,
    togglePasswordVisibility,
    resetAllSchedules
  } = useUserManagement();
  
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (role !== 'founder' && role !== 'manager' && role !== 'agent') {
      navigate('/');
    }
  }, [role, navigate, isAuthenticated]);

  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center rotate-[-30deg]">
        <p className="text-slate-200/30 text-[6vw] font-bold whitespace-nowrap">
          {username?.toUpperCase()}
        </p>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  const isFounder = role === 'founder';
  const isManager = role === 'manager';
  const isAgent = role === 'agent';
  
  const hasFullAccess = isFounder || isManager;
  
  if (isAgent && !hasFullAccess) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex">
          {usernameWatermark}

          <UltraSidebar 
            username={username || ''}
            role={role || ''}
            userId={userId || ''}
            onLogout={handleLogout}
            currentPage="users"
          />
          
          <div className="flex-1 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/")}
                    className="h-10 w-10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="text-2xl font-bold">Gestion des Utilisateurs 👥</h1>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  Retour au tableau de bord
                </Button>
              </div>

              <div className="bg-card p-8 rounded-lg border shadow text-center">
                <h2 className="text-xl font-semibold mb-4">Accès limité 🔒</h2>
                <p className="text-muted-foreground mb-6">En tant qu'agent, vous avez un accès limité à cette page.</p>
                <Button onClick={() => navigate("/")}>Retourner au tableau de bord</Button>
              </div>
              
              <Footer role={role} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex">
        {usernameWatermark}
        
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="users"
        />
        
        <div className="flex-1 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/")}
                  className="h-10 w-10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Gestion des Utilisateurs 👥</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  Retour au tableau de bord
                </Button>
                
                {isFounder && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/agency-assignment")}
                    className="flex items-center gap-2"
                  >
                    <UsersRound className="h-4 w-4" />
                    Gestion agences/créateurs
                  </Button>
                )}
                
                <ExcelImportButton />
                
                {isFounder && (
                  <ScheduleExcelImport />
                )}
                
                {isFounder && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setIsCreateAccountModalOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                )}
                
                {isFounder && (
                  <Button
                    variant="destructive"
                    onClick={resetAllSchedules}
                    className="flex items-center gap-2"
                  >
                    Réinitialiser tous les horaires
                  </Button>
                )}
              </div>
            </div>

            <div className="w-full max-w-sm mx-auto mb-6">
              <UserSearchBar onSearch={setSearchQuery} />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-8">
                {users.manager.length > 0 && (
                  <UserTable
                    users={users.manager}
                    title="Managers 👨‍💼"
                    onDeleteUser={handleDeleteUser}
                    onViewDetails={handleViewDetails}
                    onRoleChange={handleRoleChange}
                    onUsernameEdit={handleUsernameEdit}
                    onUsernameSave={() => handleUsernameSave(editingUser?.id || '')}
                    editingUser={editingUser}
                    editedUsername={editedUsername}
                    setEditedUsername={setEditedUsername}
                    showPasswords={showPasswords}
                    togglePasswordVisibility={togglePasswordVisibility}
                    userRole={role}
                    editingPassword={editingPassword}
                    setEditingPassword={setEditingPassword}
                    onPasswordEdit={handlePasswordEdit}
                    onPasswordSave={handlePasswordSave}
                  />
                )}
                {users.creator.length > 0 && (
                  <UserTable
                    users={users.creator}
                    title="Créateurs 👨‍💻"
                    onDeleteUser={handleDeleteUser}
                    onViewDetails={handleViewDetails}
                    onRoleChange={handleRoleChange}
                    onUsernameEdit={handleUsernameEdit}
                    onUsernameSave={() => handleUsernameSave(editingUser?.id || '')}
                    editingUser={editingUser}
                    editedUsername={editedUsername}
                    setEditedUsername={setEditedUsername}
                    showPasswords={showPasswords}
                    togglePasswordVisibility={togglePasswordVisibility}
                    userRole={role}
                    editingPassword={editingPassword}
                    setEditingPassword={setEditingPassword}
                    onPasswordEdit={handlePasswordEdit}
                    onPasswordSave={handlePasswordSave}
                  />
                )}
                {users.agent.length > 0 && (
                  <UserTable
                    users={users.agent}
                    title="Agents 🕵️‍♂️"
                    onDeleteUser={handleDeleteUser}
                    onViewDetails={handleViewDetails}
                    onRoleChange={handleRoleChange}
                    onUsernameEdit={handleUsernameEdit}
                    onUsernameSave={() => handleUsernameSave(editingUser?.id || '')}
                    editingUser={editingUser}
                    editedUsername={editedUsername}
                    setEditedUsername={setEditedUsername}
                    showPasswords={showPasswords}
                    togglePasswordVisibility={togglePasswordVisibility}
                    userRole={role}
                    editingPassword={editingPassword}
                    setEditingPassword={setEditingPassword}
                    onPasswordEdit={handlePasswordEdit}
                    onPasswordSave={handlePasswordSave}
                  />
                )}
              </div>
            )}

            <CreatorDetailsDialog
              isOpen={!!selectedUser}
              onClose={() => setSelectedUser(null)}
              creatorDetails={creatorDetails}
              isFounder={isFounder}
            />

            <RoleConfirmDialog
              isOpen={showRoleConfirmDialog}
              onClose={() => {
                setShowRoleConfirmDialog(false);
                setPendingRoleChange(null);
              }}
              onConfirm={handleRoleChangeConfirm}
              username={pendingRoleChange?.username}
              newRole={pendingRoleChange?.newRole}
            />
            
            {isFounder && (
              <CreateAccountModal
                isOpen={isCreateAccountModalOpen}
                onClose={() => setIsCreateAccountModalOpen(false)}
                onSubmit={handleCreateAccount}
              />
            )}
            
            <Footer role={role} />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;

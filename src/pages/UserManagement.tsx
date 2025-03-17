
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, UsersRound, FileSpreadsheet } from "lucide-react";
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

const UserManagement = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, handleLogout } = useIndexAuth();
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
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange,
    handleUsernameEdit,
    handleUsernameSave,
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
    
    if (role !== 'founder' && role !== 'manager') {
      navigate('/');
    }
  }, [role, navigate, isAuthenticated]);

  if (!isAuthenticated || (role !== 'founder' && role !== 'manager')) {
    return null;
  }

  // Agents ne peuvent pas voir cette page
  const isFounder = role === 'founder';

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex">
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
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
                <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
              </div>
              
              <div className="flex items-center gap-2">
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
                    title="Managers"
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
                  />
                )}
                {users.creator.length > 0 && (
                  <UserTable
                    users={users.creator}
                    title="Créateurs"
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
                  />
                )}
                {users.agent.length > 0 && (
                  <UserTable
                    users={users.agent}
                    title="Agents"
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
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UserManagement;

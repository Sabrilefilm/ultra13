
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { UserSearchBar } from "@/components/UserSearchBar";
import { CreatorDetailsDialog } from "@/components/creator/CreatorDetailsDialog";
import { UserTable } from "@/components/user-management/UserTable";
import { RoleConfirmDialog } from "@/components/user-management/RoleConfirmDialog";
import { useUserManagement } from "@/hooks/use-user-management";
import { CreateAccountModal } from "@/components/CreateAccountModal";

const UserManagement = () => {
  const navigate = useNavigate();
  const { role } = useIndexAuth();
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

  // Rediriger si l'utilisateur n'est pas fondateur ou manager
  useEffect(() => {
    if (role !== 'founder' && role !== 'manager') {
      navigate('/');
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen p-4">
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
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsCreateAccountModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
            
            <Button
              variant="destructive"
              onClick={resetAllSchedules}
              className="flex items-center gap-2"
            >
              Réinitialiser tous les horaires
            </Button>
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
          isFounder={role === 'founder'}
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
        
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          onClose={() => setIsCreateAccountModalOpen(false)}
          onSubmit={(data) => {
            setIsCreateAccountModalOpen(false);
            // Le hook handle déjà le refresh de la liste
          }}
        />
      </div>
    </div>
  );
};

export default UserManagement;

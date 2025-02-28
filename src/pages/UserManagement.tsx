
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
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
  const [showCreateAccount, setShowCreateAccount] = React.useState(false);
  
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
    handleCreateAccount,
  } = useUserManagement();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowCreateAccount(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
            
            {role === 'manager' && (
              <Button 
                variant="default"
                onClick={() => navigate("/user-management")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Accéder aux personnes de l'agence
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
          isOpen={showCreateAccount}
          onClose={() => setShowCreateAccount(false)}
          onSubmit={handleCreateAccount}
        />
      </div>
    </div>
  );
};

export default UserManagement;

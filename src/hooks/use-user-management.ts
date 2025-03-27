
import { useUserData } from "./user-management/use-user-data";
import { useUserRoles } from "./user-management/use-user-roles";
import { useUserEditing } from "./user-management/use-user-editing";
import { useCreatorDetails } from "./user-management/use-creator-details";
import { useScheduleManagement } from "./user-management/use-schedule-management";

export const useUserManagement = () => {
  const { 
    users, 
    allUsers,
    isLoading, 
    refetch, 
    searchQuery, 
    setSearchQuery 
  } = useUserData();

  const {
    showRoleConfirmDialog,
    setShowRoleConfirmDialog,
    pendingRoleChange,
    setPendingRoleChange,
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange
  } = useUserRoles(refetch);

  const {
    editingUser,
    setEditingUser,
    editedUsername,
    setEditedUsername,
    showPasswords,
    editingPassword,
    setEditingPassword,
    handleUsernameEdit,
    handleUsernameSave,
    handlePasswordEdit,
    handlePasswordSave,
    togglePasswordVisibility
  } = useUserEditing(refetch);

  const {
    selectedUser,
    setSelectedUser,
    creatorDetails,
    handleViewDetails
  } = useCreatorDetails();

  const {
    resetAllSchedules
  } = useScheduleManagement(refetch);

  return {
    // User data
    users,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    
    // User roles and deletion
    showRoleConfirmDialog,
    setShowRoleConfirmDialog,
    pendingRoleChange,
    setPendingRoleChange,
    handleDeleteUser,
    handleRoleChangeConfirm,
    handleRoleChange,
    
    // Username editing
    editingUser,
    setEditingUser,
    editedUsername,
    setEditedUsername,
    handleUsernameEdit,
    handleUsernameSave,
    
    // Password editing
    editingPassword,
    setEditingPassword,
    handlePasswordEdit,
    handlePasswordSave,
    
    // Password visibility
    showPasswords,
    togglePasswordVisibility,
    
    // Creator details
    selectedUser,
    setSelectedUser,
    creatorDetails,
    handleViewDetails,
    
    // Schedule management
    resetAllSchedules
  };
};

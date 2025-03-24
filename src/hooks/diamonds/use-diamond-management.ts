
import { useDiamondFetch, Creator } from './use-diamond-fetch';
import { useDiamondSearch } from './use-diamond-search';
import { useDiamondDialogs } from './use-diamond-dialogs';
import { useNavigate } from 'react-router-dom';

export function useDiamondManagement() {
  const { 
    loading, 
    creators, 
    managers, 
    agents,
    diamondValue,
    agencyGoal,
    setAgencyGoal,
    userId,
    role,
    username,
    totalAgencyDiamonds,
    agencyProgressPercentage,
    fetchAllUsers
  } = useDiamondFetch();

  const {
    searchQuery,
    filteredCreators,
    activeTab,
    setActiveTab,
    handleSearch,
    getActiveUsers
  } = useDiamondSearch(creators);

  const {
    isDialogOpen,
    setIsDialogOpen,
    isDiamondModalOpen,
    setIsDiamondModalOpen,
    selectedCreator,
    setSelectedCreator,
    newDiamondGoal,
    setNewDiamondGoal,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    isEditing,
    openEditDialog,
    openDiamondModal,
    handleUpdateDiamondGoal,
    handleUpdateDiamonds,
    handleUpdateAgencyGoal
  } = useDiamondDialogs(fetchAllUsers);

  // Expose all the functionality from the sub-hooks
  return {
    loading,
    creators,
    filteredCreators,
    searchQuery,
    userId,
    role,
    username,
    isDialogOpen,
    setIsDialogOpen,
    selectedCreator,
    setSelectedCreator,
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
    setOperationType,
    activeTab,
    setActiveTab,
    managers,
    agents,
    totalAgencyDiamonds,
    agencyProgressPercentage,
    handleSearch,
    openEditDialog,
    openDiamondModal,
    handleUpdateDiamondGoal,
    handleUpdateDiamonds,
    handleUpdateAgencyGoal: () => handleUpdateAgencyGoal(agencyGoal),
    fetchAllUsers,
    getActiveUsers: () => getActiveUsers(managers, agents)
  };
}

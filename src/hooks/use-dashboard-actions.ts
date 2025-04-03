
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDashboardActions = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();
  
  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal states
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  
  const onAction = useCallback((action: string, data?: any) => {
    // Reset mobile menu immediately for better UX when an action is triggered
    setMobileMenuOpen(false);
    
    switch (action) {
      case "navigateTo":
        if (typeof data === 'string' && data.startsWith('/')) {
          navigate(data);
        } else {
          console.error('Invalid navigation path:', data);
        }
        break;
        
      case "toggleMobileMenu":
        setMobileMenuOpen(prevState => !prevState);
        break;
        
      case "openCreateAccount":
        setIsCreateAccountModalOpen(true);
        break;
        
      case "openRewardSettings":
        setIsRewardSettingsModalOpen(true);
        break;
        
      case "openLiveSchedule":
        setSelectedCreatorId(data);
        setIsLiveScheduleModalOpen(true);
        break;
        
      case "openScheduleMatch":
        setIsScheduleMatchModalOpen(true);
        break;
        
      case "openSponsorshipForm":
        setIsSponsorshipModalOpen(true);
        break;
        
      case "openSponsorshipList":
        setShowSponsorshipList(true);
        break;
        
      case "openCreatePoster":
        setIsCreatePosterModalOpen(true);
        break;
        
      case "logout":
        onLogout();
        navigate('/');
        break;
        
      default:
        console.warn(`Action '${action}' not implemented`);
    }
  }, [navigate, onLogout]);
  
  return {
    modalStates: {
      isCreateAccountModalOpen,
      setIsCreateAccountModalOpen,
      isRewardSettingsModalOpen,
      setIsRewardSettingsModalOpen,
      isLiveScheduleModalOpen,
      setIsLiveScheduleModalOpen,
      isScheduleMatchModalOpen,
      setIsScheduleMatchModalOpen,
      isSponsorshipModalOpen,
      setIsSponsorshipModalOpen,
      showSponsorshipList,
      setShowSponsorshipList,
      isCreatePosterModalOpen,
      setIsCreatePosterModalOpen
    },
    sidebarStates: {
      mobileMenuOpen,
      setMobileMenuOpen
    },
    selectedCreatorId,
    onAction
  };
};

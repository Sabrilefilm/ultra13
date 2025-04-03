
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface UseDashboardActionsProps {
  onLogout: () => void;
}

export function useDashboardActions({ onLogout }: UseDashboardActionsProps) {
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [isRewardSettingsModalOpen, setIsRewardSettingsModalOpen] = useState(false);
  const [isLiveScheduleModalOpen, setIsLiveScheduleModalOpen] = useState(false);
  const [isScheduleMatchModalOpen, setIsScheduleMatchModalOpen] = useState(false);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string>("");
  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [showSponsorshipList, setShowSponsorshipList] = useState(false);
  const [isCreatePosterModalOpen, setIsCreatePosterModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  const onAction = useCallback((action: string, data?: any) => {
    switch (action) {
      case 'openCreateAccount':
        setIsCreateAccountModalOpen(true);
        break;
      case 'openRewardSettings':
        setIsRewardSettingsModalOpen(true);
        break;
      case 'openLiveSchedule':
        setSelectedCreatorId(data);
        setIsLiveScheduleModalOpen(true);
        break;
      case 'openScheduleMatch':
        setIsScheduleMatchModalOpen(true);
        break;
      case 'openSponsorshipForm':
        setIsSponsorshipModalOpen(true);
        break;
      case 'openSponsorshipList':
        setShowSponsorshipList(true);
        break;
      case 'openCreatePoster':
        setIsCreatePosterModalOpen(true);
        break;
      case 'navigateTo':
        navigate(data === 'dashboard' ? '/' : `/${data}`);
        break;
      case 'toggleSidebar':
        setSidebarCollapsed(!sidebarCollapsed);
        break;
      case 'toggleMobileMenu':
        setMobileMenuOpen(!mobileMenuOpen);
        break;
      default:
        break;
    }
  }, [navigate, sidebarCollapsed]);

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
      setIsCreatePosterModalOpen,
    },
    sidebarStates: {
      sidebarCollapsed,
      mobileMenuOpen,
      setMobileMenuOpen
    },
    selectedCreatorId,
    onAction,
    onLogout
  };
}

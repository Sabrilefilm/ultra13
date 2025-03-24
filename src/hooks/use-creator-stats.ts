
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { creatorStatsService } from "@/services/creator-stats-service";
import { toast } from "sonner";
import { usePlatformSettings } from "@/hooks/use-platform-settings";

interface Creator {
  id: string;
  username: string;
  live_schedules?: Array<{ hours: number; days: number }>;
  profiles?: Array<{ total_diamonds: number }>;
}

export const useCreatorStats = (role: string | null, username: string | null) => {
  const navigate = useNavigate();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  
  // Dialog states
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [hours, setHours] = useState(0);
  const [days, setDays] = useState(0);
  
  const [isEditingDiamonds, setIsEditingDiamonds] = useState(false);
  const [diamondAmount, setDiamondAmount] = useState(0);
  const [operationType, setOperationType] = useState<'set' | 'add' | 'subtract'>('set');
  
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  
  const { platformSettings } = usePlatformSettings(role);
  const rewardThreshold = 36000;

  useEffect(() => {
    if (!['agent', 'manager', 'founder', 'ambassadeur'].includes(role || '')) {
      navigate('/');
      return;
    }

    fetchCreators();
  }, [navigate, role, username]);

  const fetchCreators = async () => {
    if (!role || !username) return;
    
    setLoading(true);
    try {
      const creatorsData = await creatorStatsService.fetchCreators(role, username);
      setCreators(creatorsData);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const getTotalHours = () => {
    return creators.reduce((total, creator) => {
      const hours = creator.live_schedules?.[0]?.hours || 0;
      return total + Number(hours);
    }, 0);
  };

  const getTotalDays = () => {
    return creators.reduce((total, creator) => {
      const days = creator.live_schedules?.[0]?.days || 0;
      return total + Number(days);
    }, 0);
  };

  const getTotalDiamonds = () => {
    return creators.reduce((total, creator) => {
      const diamonds = creator.profiles?.[0]?.total_diamonds || 0;
      return total + Number(diamonds);
    }, 0);
  };

  const getCreatorsWithRewards = () => {
    return creators.filter(creator => 
      (creator.profiles?.[0]?.total_diamonds || 0) >= rewardThreshold
    ).length;
  };

  const handleEditSchedule = (creator: Creator) => {
    setSelectedCreator(creator);
    setHours(creator.live_schedules?.[0]?.hours || 0);
    setDays(creator.live_schedules?.[0]?.days || 0);
    setIsEditingSchedule(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedCreator) return;
    
    try {
      await creatorStatsService.updateSchedule(selectedCreator, hours, days);
      
      toast.success("Horaires mis à jour avec succès");
      
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            live_schedules: [{ hours, days }]
          };
        }
        return c;
      }));
      
      setIsEditingSchedule(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des horaires");
    }
  };

  const handleEditDiamonds = (creator: Creator) => {
    setSelectedCreator(creator);
    setDiamondAmount(creator.profiles?.[0]?.total_diamonds || 0);
    setOperationType('set');
    setIsEditingDiamonds(true);
  };

  const handleSaveDiamonds = async () => {
    if (!selectedCreator) return;
    
    try {
      let newDiamondValue = 0;
      const currentDiamonds = selectedCreator.profiles?.[0]?.total_diamonds || 0;
      
      switch (operationType) {
        case 'set':
          newDiamondValue = diamondAmount;
          break;
        case 'add':
          newDiamondValue = currentDiamonds + diamondAmount;
          break;
        case 'subtract':
          newDiamondValue = Math.max(0, currentDiamonds - diamondAmount);
          break;
      }
      
      await creatorStatsService.updateDiamonds(selectedCreator, newDiamondValue);
      
      setCreators(creators.map(c => {
        if (c.id === selectedCreator.id) {
          return {
            ...c,
            profiles: [{ total_diamonds: newDiamondValue }]
          };
        }
        return c;
      }));
      
      const actionText = operationType === 'set' ? 'définis à' : operationType === 'add' ? 'augmentés de' : 'réduits de';
      toast.success(`Diamants ${actionText} ${diamondAmount} pour ${selectedCreator.username}`);
      setIsEditingDiamonds(false);
      
      // Refresh the data to ensure everything is up to date
      fetchCreators();
      
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des diamants");
    }
  };

  const handleRemoveCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveCreator = async () => {
    if (!selectedCreator) return;
    
    try {
      await creatorStatsService.removeCreator(selectedCreator.id);
      
      toast.success("Créateur retiré avec succès");
      
      setCreators(creators.filter(c => c.id !== selectedCreator.id));
      setRemoveDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors du retrait du créateur");
    }
  };

  return {
    creators,
    loading,
    selectedCreator,
    isEditingSchedule,
    setIsEditingSchedule,
    hours, 
    setHours,
    days,
    setDays,
    isEditingDiamonds,
    setIsEditingDiamonds,
    diamondAmount,
    setDiamondAmount,
    operationType,
    setOperationType,
    removeDialogOpen,
    setRemoveDialogOpen,
    rewardThreshold,
    platformSettings,
    getTotalHours,
    getTotalDays,
    getTotalDiamonds,
    getCreatorsWithRewards,
    handleEditSchedule,
    handleSaveSchedule,
    handleEditDiamonds,
    handleSaveDiamonds,
    handleRemoveCreator,
    confirmRemoveCreator
  };
};

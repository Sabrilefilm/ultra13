
import { Creator } from "./types";

export const useStatistics = (creators: Creator[]) => {
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

  const getCreatorsWithRewards = (rewardThreshold: number) => {
    return creators.filter(creator => 
      (creator.profiles?.[0]?.total_diamonds || 0) >= rewardThreshold
    ).length;
  };

  return {
    getTotalHours,
    getTotalDays,
    getTotalDiamonds,
    getCreatorsWithRewards
  };
};

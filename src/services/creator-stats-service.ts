
import { toast } from "sonner";
import { creatorsApi, Creator } from "./api/creators-api";
import { scheduleService } from "./schedule/schedule-service";
import { diamondsService } from "./diamonds/diamonds-service";
import { creatorManagementService } from "./creators/creator-management-service";

export const creatorStatsService = {
  async fetchCreators(role: string, username: string) {
    try {
      // Fetch creators with their schedule data
      const creatorData = await creatorsApi.fetchCreatorsByRole(role, username);
      
      if (!creatorData || creatorData.length === 0) {
        console.log("No creators found");
        return [];
      }
      
      // Extract creator IDs for diamond lookup
      const creatorIds = creatorData.map(creator => creator.id) || [];
      
      console.log("Fetching diamonds for creator IDs:", creatorIds);
      
      // Get diamonds data
      const diamondsData = await creatorsApi.fetchDiamondsByCreators(creatorIds);
      
      console.log("Diamond data received:", diamondsData);
      
      // Combine the data
      const formattedData = creatorData.map(creator => ({
        ...creator,
        profiles: [{ total_diamonds: diamondsData[creator.id] || 0 }]
      }));
      
      console.log("Formatted creator data with diamonds:", formattedData);
      
      return formattedData;
    } catch (error) {
      console.error("Error fetching creators:", error);
      throw error;
    }
  },

  updateSchedule: scheduleService.updateSchedule,
  updateDiamonds: (creator: Creator, diamonds: number, operation: 'set' | 'add' | 'subtract' = 'set') => {
    return diamondsService.updateDiamonds(creator, diamonds, operation);
  },
  removeCreator: creatorManagementService.removeCreator,
  resetAllSchedules: scheduleService.resetAllSchedules,
  resetAllDiamonds: diamondsService.resetAllDiamonds
};

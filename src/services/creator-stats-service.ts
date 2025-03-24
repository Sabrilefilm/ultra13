
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
      
      // Extract creator IDs for diamond lookup
      const creatorIds = creatorData.map(creator => creator.id) || [];
      
      // Get diamonds data
      const diamondsData = await creatorsApi.fetchDiamondsByCreators(creatorIds);
      
      // Combine the data
      const formattedData = creatorData.map(creator => ({
        ...creator,
        profiles: [{ total_diamonds: diamondsData[creator.id] || 0 }]
      }));
      
      return formattedData;
    } catch (error) {
      console.error("Error fetching creators:", error);
      throw error;
    }
  },

  updateSchedule: scheduleService.updateSchedule,
  updateDiamonds: diamondsService.updateDiamonds,
  removeCreator: creatorManagementService.removeCreator,
  resetAllSchedules: scheduleService.resetAllSchedules,
  resetAllDiamonds: diamondsService.resetAllDiamonds
};


import { SetStateAction, Dispatch } from "react";
import { Schedule } from "../types";

export function updateScheduleField(
  setSchedules: Dispatch<SetStateAction<Schedule[]>>,
  scheduleId: string,
  field: "hours" | "days" | "is_active",
  value: string | boolean
) {
  setSchedules((prev) => {
    const newSchedules = prev.map((schedule) =>
      schedule.id === scheduleId
        ? { 
            ...schedule, 
            [field]: field === "is_active" ? value : Number(value)
          }
        : schedule
    );
    return newSchedules;
  });
}

export function initializeSchedule(creatorId: string, creatorName: string, existingData: any): Schedule {
  return {
    id: existingData?.id || 'new-schedule',
    hours: existingData?.hours || 0,
    days: existingData?.days || 0,
    is_active: true,
    creator_name: creatorName,
    creator_id: creatorId
  };
}

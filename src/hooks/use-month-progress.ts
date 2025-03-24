
import { useState, useEffect } from 'react';

export interface MonthProgress {
  dayOfMonth: number;
  daysInMonth: number;
  monthProgress: number;
}

export const useMonthProgress = (): MonthProgress => {
  const [dayOfMonth, setDayOfMonth] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [monthProgress, setMonthProgress] = useState(0);

  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    setDayOfMonth(currentDay);
    setDaysInMonth(lastDay);
    setMonthProgress(Math.floor((currentDay / lastDay) * 100));
  }, []);

  return { dayOfMonth, daysInMonth, monthProgress };
};

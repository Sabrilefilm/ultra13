
import { supabase } from '@/lib/supabase';
import { Schedule } from '@/components/live-schedule/types';
import { toast } from 'sonner';

export const fetchScheduleForCreator = async (creatorId: string): Promise<Schedule | null> => {
  try {
    const { data, error } = await supabase
      .from('live_schedules')
      .select('*')
      .eq('creator_id', creatorId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du planning :', error);
    toast.error('Impossible de récupérer le planning');
    return null;
  }
};

export const createOrUpdateSchedule = async (
  schedule: { hours: number; days: number },
  creatorId: string
): Promise<boolean> => {
  try {
    // Check if a schedule already exists for this creator
    const { data: existingSchedule, error: checkError } = await supabase
      .from('live_schedules')
      .select('id')
      .eq('creator_id', creatorId)
      .maybeSingle();

    if (checkError) {
      throw checkError;
    }

    if (existingSchedule) {
      // Update existing schedule
      const { error: updateError } = await supabase
        .from('live_schedules')
        .update({
          hours: schedule.hours,
          days: schedule.days,
          is_active: true
        })
        .eq('id', existingSchedule.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new schedule
      const { error: insertError } = await supabase
        .from('live_schedules')
        .insert({
          creator_id: creatorId,
          hours: schedule.hours,
          days: schedule.days,
          is_active: true
        });

      if (insertError) {
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du planning :', error);
    toast.error('Impossible de mettre à jour le planning');
    return false;
  }
};

export const fetchCreators = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('id, username')
      .eq('role', 'creator');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des créateurs :', error);
    toast.error('Impossible de récupérer la liste des créateurs');
    return [];
  }
};

export const getCreatorName = async (creatorId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('username')
      .eq('id', creatorId)
      .single();

    if (error) {
      throw error;
    }

    return data.username || 'Inconnu';
  } catch (error) {
    console.error('Erreur lors de la récupération du nom du créateur :', error);
    return 'Inconnu';
  }
};

// Add missing exported functions
export const fetchProfileByUsername = async (username: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('user_accounts')
      .select('id, username')
      .eq('username', username)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error);
    toast.error('Impossible de récupérer le profil');
    return null;
  }
};

export const fetchScheduleByCreatorId = async (creatorId: string): Promise<Schedule | null> => {
  return fetchScheduleForCreator(creatorId);
};

export const fetchAllCreatorSchedules = async (): Promise<Schedule[]> => {
  try {
    const { data, error } = await supabase
      .from('live_schedules')
      .select(`
        *,
        user_accounts(username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des plannings :', error);
    toast.error('Impossible de récupérer les plannings');
    return [];
  }
};

export const saveSchedule = async (
  schedule: Schedule,
  creatorId: string
): Promise<boolean> => {
  return createOrUpdateSchedule({
    hours: schedule.hours,
    days: schedule.days
  }, creatorId);
};


export interface Match {
  id: string;
  creator_id: string;
  opponent_id: string;
  match_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'off' | 'completed_off';
  winner_id?: string;
  platform?: string;
  match_image?: string;
  source?: string;
  points?: number;
  creator1_name?: string;
  creator2_name?: string;
  agent_name?: string;
  with_boost?: boolean;
  
  // Adding missing properties referenced in Schedule.tsx
  title?: string;
  creator1_id?: string; // For clarity when referencing the first creator
  match_name?: string;
}


export interface Account {
  id: string;
  username: string;
  password: string;
  role: string;
  email?: string;
  agent_id?: string;
  profile?: {
    total_diamonds: number;
    days_streamed: number;
    total_live_hours: number;
  };
  live_schedules?: Array<{ hours: number; days: number }>;
  creator_contacts?: Array<{ 
    phone: string;
    whatsapp: string;
    email: string;
    discord: string;
    other: string;
  }>;
}

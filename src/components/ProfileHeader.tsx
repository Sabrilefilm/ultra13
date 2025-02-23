
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TikTokLogin } from "./TikTokLogin";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ProfileHeaderProps {
  username: string;
  handle: string;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username: initialUsername, 
  handle: initialHandle, 
  avatarUrl: initialAvatarUrl 
}) => {
  const [userProfile, setUserProfile] = useState({
    username: initialUsername,
    handle: initialHandle,
    avatarUrl: initialAvatarUrl
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { user } = session;
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, handle, avatar_url')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile({
            username: profile.username || initialUsername,
            handle: profile.handle || initialHandle,
            avatarUrl: profile.avatar_url || initialAvatarUrl
          });
        }
      }
      setIsLoading(false);
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        fetchProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUsername, initialHandle, initialAvatarUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-4 p-6 animate-pulse">
        <div className="w-14 h-14 bg-primary/50 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-primary/50 rounded" />
          <div className="h-4 w-24 bg-primary/50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 p-6 animate-fadeIn">
      <Avatar className="w-14 h-14">
        <AvatarImage src={userProfile.avatarUrl} alt={userProfile.username} />
        <AvatarFallback className="bg-primary">
          <User className="w-8 h-8 text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenue, {userProfile.username}
        </h1>
        <p className="text-secondary">{userProfile.handle}</p>
        {!userProfile.avatarUrl && <TikTokLogin />}
      </div>
    </div>
  );
};


import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  username: string;
  handle: string;
  avatarUrl?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username, 
  handle, 
  avatarUrl 
}) => {
  return (
    <div className="flex items-center space-x-4 p-6 animate-fadeIn">
      <Avatar className="w-14 h-14">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback className="bg-primary">
          <User className="w-8 h-8 text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenue, {username}
        </h1>
        <p className="text-secondary">{handle}</p>
      </div>
    </div>
  );
};

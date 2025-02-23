
import { User } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  handle: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, handle }) => {
  return (
    <div className="flex items-center space-x-4 p-6 animate-fadeIn">
      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
        <User className="w-8 h-8 text-white" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">
          Bienvenue, {username}
        </h1>
        <p className="text-secondary">{handle}</p>
      </div>
    </div>
  );
};

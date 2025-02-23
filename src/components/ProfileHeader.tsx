
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  username: string;
  handle: string;
}

export function ProfileHeader({ username, handle }: ProfileHeaderProps) {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold leading-none">{username}</h2>
        <p className="text-sm text-muted-foreground leading-none mt-1">{handle}</p>
      </div>
    </div>
  );
}

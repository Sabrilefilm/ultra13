
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSearchBarProps {
  onSearch: (query: string) => void;
}

export const UserSearchBar = ({ onSearch }: UserSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        placeholder="Rechercher un utilisateur..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};

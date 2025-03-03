
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Account } from "@/types/accounts";
import { useState } from "react";

export const useUserData = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`
          *,
          live_schedules (
            hours,
            days
          )
        `)
        .order("role", { ascending: true });

      if (error) throw error;
      return data as (Account & { live_schedules: { hours: number; days: number }[] })[];
    },
  });

  const filteredUsers = users
    ?.filter(user => {
      if (!searchQuery) return true;
      const search = searchQuery.toLowerCase();
      return (
        user.username.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    }) || [];

  const groupedUsers = {
    manager: filteredUsers.filter(user => user.role === "manager"),
    creator: filteredUsers.filter(user => user.role === "creator"),
    agent: filteredUsers.filter(user => user.role === "agent"),
  };

  return {
    users: groupedUsers,
    allUsers: users || [],
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
  };
};

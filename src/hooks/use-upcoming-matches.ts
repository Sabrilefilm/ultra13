
import { useFetchMatches } from "./matches/use-fetch-matches";
import { useDeleteMatch } from "./matches/use-delete-match";
import { useWinnerManagement } from "./matches/use-winner-management";
import { useUpdateMatch } from "./matches/use-update-match";

export const useUpcomingMatches = (role: string, creatorId: string) => {
  const { matches, isLoading } = useFetchMatches(creatorId);
  const { handleDelete } = useDeleteMatch(creatorId);
  const { setWinner, clearWinner } = useWinnerManagement(creatorId);
  const { updateMatchDetails } = useUpdateMatch(creatorId);

  return {
    matches,
    isLoading,
    handleDelete,
    setWinner,
    clearWinner,
    updateMatchDetails
  };
};

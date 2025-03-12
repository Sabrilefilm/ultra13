
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface CreatorSelectProps {
  onSelect: (username: string) => void;
  value?: string;
}

interface Creator {
  username: string;
  id: string;
}

export const CreatorSelect = ({ onSelect, value }: CreatorSelectProps) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("user_accounts")
          .select("id, username")
          .eq('role', 'creator')
          .order("username");

        if (error) throw error;

        setCreators(data || []);
        console.log("Fetched creators:", data);
      } catch (error) {
        console.error("Erreur lors du chargement des créateurs:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des créateurs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onSelect}
    >
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <SelectValue placeholder="Sélectionner un créateur" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>
            Chargement...
          </SelectItem>
        ) : creators.length === 0 ? (
          <SelectItem value="none" disabled>
            Aucun créateur disponible
          </SelectItem>
        ) : (
          creators.map((creator) => (
            <SelectItem key={creator.id} value={creator.username}>
              {creator.username}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

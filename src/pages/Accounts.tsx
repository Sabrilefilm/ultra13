
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Trash2, Eye, EyeOff, Search, Diamond, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

interface Account {
  id: string;
  username: string;
  password: string;
  role: string;
  profile?: {
    total_diamonds: number;
  };
  schedules?: {
    day_of_week: string;
    start_time: string;
    end_time: string;
  }[];
}

const Accounts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showPasswords, setShowPasswords] = React.useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`
          *,
          profile:profiles(total_diamonds),
          schedules:live_schedules(day_of_week, start_time, end_time)
        `)
        .order("role", { ascending: true });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les comptes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: string, username: string) => {
    try {
      const { error } = await supabase
        .from("user_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAccounts(accounts.filter(account => account.id !== id));
      toast({
        title: "Compte supprimé",
        description: `Le compte ${username} a été supprimé avec succès`,
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredAccounts = accounts.filter(account => {
    const searchLower = searchQuery.toLowerCase();
    return (
      account.username.toLowerCase().includes(searchLower) ||
      account.role.toLowerCase().includes(searchLower)
    );
  });

  const translateRole = (role: string) => {
    switch (role) {
      case 'creator':
        return 'Créateur';
      case 'manager':
        return 'Manager';
      default:
        return role;
    }
  };

  const translateDay = (day: string) => {
    const days: { [key: string]: string } = {
      'monday': 'Lundi',
      'tuesday': 'Mardi',
      'wednesday': 'Mercredi',
      'thursday': 'Jeudi',
      'friday': 'Vendredi',
      'saturday': 'Samedi',
      'sunday': 'Dimanche'
    };
    return days[day.toLowerCase()] || day;
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Format HH:mm
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" />
            Espace Identifiants
          </h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{account.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        {translateRole(account.role)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sm"
                        onClick={() => togglePasswordVisibility(account.id)}
                      >
                        <span className="mr-2">
                          {showPasswords[account.id] ? account.password : '••••••'}
                        </span>
                        {showPasswords[account.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAccount(account.id, account.username)}
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {account.role === 'creator' && (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Diamond className="h-4 w-4" />
                        <span>Total des diamants : {account.profile?.total_diamonds || 0}</span>
                      </div>
                      
                      {account.schedules && account.schedules.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Horaires :
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {account.schedules.map((schedule, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {translateDay(schedule.day_of_week)} : {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;

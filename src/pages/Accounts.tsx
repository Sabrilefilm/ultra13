
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Trash2, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

const Accounts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showPasswords, setShowPasswords] = React.useState<{[key: string]: boolean}>({});
  const [newUsername, setNewUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("user_accounts")
        .select("*")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
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
          <div className="w-10" />
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">{account.role}</h3>
                    <p className="text-muted-foreground">{account.username}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="relative group px-3 py-1 h-8"
                      onClick={() => togglePasswordVisibility(account.id)}
                    >
                      <span className="text-sm font-medium">
                        {showPasswords[account.id] ? account.password : '••••••'}
                      </span>
                      {showPasswords[account.id] ? (
                        <EyeOff className="h-4 w-4 ml-2 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <Eye className="h-4 w-4 ml-2 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteAccount(account.id, account.username)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserAccount {
  id: string;
  username: string;
  password: string;
  role: string;
  created_at: string;
}

export default function Accounts() {
  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_accounts')
        .select('*');
      
      if (error) throw error;
      return data as UserAccount[];
    }
  });

  if (isLoading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">Une erreur est survenue</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Liste des comptes utilisateurs</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Identifiant</TableHead>
              <TableHead>Mot de passe</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts?.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.password}</TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

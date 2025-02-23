
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SponsorshipFormProps {
  creatorId: string;
  onSubmit?: () => void;
}

export const SponsorshipForm = ({ creatorId, onSubmit }: SponsorshipFormProps) => {
  const [creatorTiktok, setCreatorTiktok] = useState('');
  const [sponsorTiktok, setSponsorTiktok] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [agentName, setAgentName] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('sponsorships')
        .insert([
          {
            creator_tiktok: creatorTiktok,
            sponsor_tiktok: sponsorTiktok,
            invitation_code: invitationCode,
            agent_name: agentName,
            creator_id: creatorId
          }
        ]);

      if (error) throw error;

      toast({
        title: "Demande de parrainage envoyée",
        description: "Votre demande a été soumise avec succès",
        duration: 60000,
      });

      // Reset form
      setCreatorTiktok('');
      setSponsorTiktok('');
      setInvitationCode('');
      setAgentName('');

      if (onSubmit) onSubmit();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande de parrainage",
        variant: "destructive",
        duration: 60000,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center mb-4">Formulaire de parrainage</CardTitle>
        <p className="text-center text-muted-foreground">
          Phocéen agency vous remercie de votre parrainage, la famille ça agit de plus en plus et Nous espérons vous garder le plus longtemps possible
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Votre Tiktok</label>
              <Input
                value={creatorTiktok}
                onChange={(e) => setCreatorTiktok(e.target.value)}
                placeholder="@"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">TikTok de votre Parrain</label>
              <Input
                value={sponsorTiktok}
                onChange={(e) => setSponsorTiktok(e.target.value)}
                placeholder="@"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Code d'invitation</label>
            <Input
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Le Nom de votre agent ou du créateur</label>
            <Input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Saisir son nom ou @"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-[#C5A467] hover:bg-[#C5A467]/90">
            SOUMETTRE
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

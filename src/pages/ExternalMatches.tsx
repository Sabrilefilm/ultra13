
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rocket, ArrowLeft, Calendar, User, Users, Clock, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type UpcomingMatch = {
  id: string;
  creator_id: string;
  opponent_id: string;
  match_date: string;
  status: string;
  winner_id: string | null;
  points: number | null;
  source: string | null;
  image_url: string | null;
};

const ExternalMatches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchRequest, setMatchRequest] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    opponentName: "",
    proposedDate: "",
    message: "",
  });

  React.useEffect(() => {
    fetchUpcomingMatches();
  }, []);

  const fetchUpcomingMatches = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .gte('match_date', currentDate.toISOString())
        .is('winner_id', null)
        .order('match_date', { ascending: true });
        
      if (error) throw error;
      
      setMatches(data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les matchs à venir",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMatchRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matchRequest.agencyName || !matchRequest.contactName || !matchRequest.email || !matchRequest.opponentName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Envoyer la demande de match
      const { error } = await supabase
        .from('match_requests')
        .insert([{
          agency_name: matchRequest.agencyName,
          contact_name: matchRequest.contactName,
          email: matchRequest.email,
          phone: matchRequest.phone,
          opponent_name: matchRequest.opponentName,
          proposed_date: matchRequest.proposedDate,
          message: matchRequest.message,
          status: 'pending',
          created_at: new Date().toISOString(),
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Demande envoyée",
        description: "Votre demande de match a été envoyée avec succès",
      });
      
      // Réinitialiser le formulaire
      setMatchRequest({
        agencyName: "",
        contactName: "",
        email: "",
        phone: "",
        opponentName: "",
        proposedDate: "",
        message: "",
      });
      
    } catch (error) {
      console.error("Error submitting match request:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande de match",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">AGENCY PHOCÉEN</h1>
              <p className="text-sm text-white/60">Espace de matchs externes</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Upcoming Matches */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Matchs à venir</h2>
            <p className="text-white/60">
              Découvrez les prochains matchs programmés par notre agence.
            </p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-32">
                    <CardContent className="p-6"></CardContent>
                  </Card>
                ))}
              </div>
            ) : matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-400" />
                            <span className="text-white/80">
                              {format(new Date(match.match_date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-400" />
                            <span className="text-white/80">
                              <span className="font-medium text-white">{match.creator_id}</span> vs <span className="font-medium text-white">{match.opponent_id}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-400" />
                            <span className="text-white/80">
                              Durée: 8 minutes | Type: {match.status === 'off' ? 'Sans Boost' : 'Avec Boost'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center py-12">
                  <Calendar className="h-10 w-10 text-purple-400 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-1">Aucun match programmé</h3>
                  <p className="text-white/60">Les prochains matchs apparaîtront ici une fois planifiés.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Request Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Demande de match</h2>
            <p className="text-white/60">
              Vous souhaitez organiser un match contre notre agence ? Remplissez ce formulaire pour nous envoyer votre demande.
            </p>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agencyName" className="text-white/90">Nom de votre agence *</Label>
                      <Input
                        id="agencyName"
                        name="agencyName"
                        value={matchRequest.agencyName}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Nom de votre agence"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-white/90">Votre nom *</Label>
                      <Input
                        id="contactName"
                        name="contactName"
                        value={matchRequest.contactName}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white/90">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={matchRequest.email}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Votre adresse email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/90">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={matchRequest.phone}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        placeholder="Votre numéro de téléphone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="opponentName" className="text-white/90">Nom du créateur adverse *</Label>
                    <Input
                      id="opponentName"
                      name="opponentName"
                      value={matchRequest.opponentName}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      placeholder="Nom du créateur qui jouera le match"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proposedDate" className="text-white/90">Date proposée pour le match</Label>
                    <Input
                      id="proposedDate"
                      name="proposedDate"
                      type="datetime-local"
                      value={matchRequest.proposedDate}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/90">Message supplémentaire</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={matchRequest.message}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
                      placeholder="Informations complémentaires sur votre demande..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer ma demande
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalMatches;

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, TrendingUp, Users, Calendar, Award, MessageSquare, Trophy, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface StatCardsProps {
  role: string;
  onOpenSponsorshipForm: () => void;
  onOpenSponsorshipList: () => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ role, onOpenSponsorshipForm, onOpenSponsorshipList }) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            Performance
          </CardTitle>
          <CardDescription>
            Suivez les performances de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">+20%</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Par rapport au mois dernier
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/team-management")}>
            Voir les détails
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-br from-green-600/10 to-yellow-600/10 border-green-200 dark:border-green-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-green-400" />
            Utilisateurs
          </CardTitle>
          <CardDescription>
            Gérez les membres de votre communauté
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,250</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Abonnés actifs
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/user-management")}>
            Gérer les utilisateurs
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-200 dark:border-orange-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-400" />
            Événements
          </CardTitle>
          <CardDescription>
            Planifiez vos prochains événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">3</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Événements à venir
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/schedule")}>
            Voir le calendrier
          </Button>
        </CardFooter>
      </Card>

      {role === 'creator' && (
        <Card className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 border-pink-200 dark:border-pink-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="h-5 w-5 text-pink-400" />
              Sponsorings
            </CardTitle>
            <CardDescription>
              Gérez vos opportunités de sponsoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sponsorings disponibles
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onOpenSponsorshipForm}>
              Nouveau Sponsoring
            </Button>
            <Button variant="secondary" onClick={onOpenSponsorshipList}>
              Voir les détails
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

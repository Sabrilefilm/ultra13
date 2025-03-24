import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowUpRight, TrendingUp, Users, Calendar, Award, MessageSquare, Trophy, BookOpen, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface StatCardsProps {
  role: string;
  onOpenSponsorshipForm?: () => void;
  onOpenSponsorshipList?: () => void;
  onCreatePoster?: () => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  role,
  onOpenSponsorshipForm = () => {},
  onOpenSponsorshipList = () => {},
  onCreatePoster = () => {}
}) => {
  const navigate = useNavigate();
  const [isTopPerformersOpen, setIsTopPerformersOpen] = useState(false);
  
  const topPerformers = [
    { id: 1, name: "Créateur 1", avatar: "C1", growth: "+32%", diamonds: 150000, category: "TikTok" },
    { id: 2, name: "Créateur 2", avatar: "C2", growth: "+28%", diamonds: 120000, category: "TikTok" },
    { id: 3, name: "Créateur 3", avatar: "C3", growth: "+25%", diamonds: 110000, category: "YouTube" },
    { id: 4, name: "Créateur 4", avatar: "C4", growth: "+22%", diamonds: 95000, category: "TikTok" },
    { id: 5, name: "Créateur 5", avatar: "C5", growth: "+18%", diamonds: 80000, category: "YouTube" }
  ];
  
  const [trendingValue, setTrendingValue] = useState(20);
  const [trendingDirection, setTrendingDirection] = useState<'up' | 'down'>('up');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 11) + 15;
      setTrendingValue(newValue);
      setTrendingDirection(Math.random() > 0.3 ? 'up' : 'down');
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-purple-200 dark:border-purple-900/30 overflow-hidden">
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
            <motion.div 
              className="text-3xl font-bold flex items-center"
              animate={{ 
                color: trendingDirection === 'up' ? ["#8B5CF6", "#10B981", "#8B5CF6"] : ["#8B5CF6", "#EF4444", "#8B5CF6"] 
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {trendingDirection === 'up' ? (
                <ChevronUp className="text-green-500 mr-1" />
              ) : (
                <ChevronDown className="text-red-500 mr-1" />
              )}
              {trendingValue}%
            </motion.div>
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
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-gradient-to-br from-blue-600/10 to-green-600/10 border-blue-200 dark:border-blue-900/30 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-400" />
              Créateurs Performants
            </CardTitle>
            <CardDescription>
              Les meilleurs créateurs du mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-2">
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {topPerformers.slice(0, 3).map((performer, index) => (
                  <motion.div 
                    key={performer.id}
                    variants={cardVariants}
                    className="flex items-center justify-between py-1 border-b border-blue-100 dark:border-blue-900/20"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600">
                        <AvatarFallback>{performer.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{performer.name}</span>
                    </div>
                    <Badge 
                      className={index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-600"}
                    >
                      {performer.growth}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => navigate('/creator-rankings')}
              className="flex items-center gap-2"
            >
              Voir le classement complet
            </Button>
          </CardFooter>
          
          <Dialog open={isTopPerformersOpen} onOpenChange={setIsTopPerformersOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Créateurs Performants</DialogTitle>
                <DialogDescription>
                  Liste des créateurs ayant obtenu les meilleures performances ce mois-ci
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Tabs defaultValue="tiktok">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tiktok" className="mt-4">
                    <div className="space-y-3">
                      {topPerformers.filter(p => p.category === "TikTok").map((performer, index) => (
                        <div key={performer.id} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600">
                                <AvatarFallback>{performer.avatar}</AvatarFallback>
                              </Avatar>
                              {index < 3 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{performer.name}</p>
                              <p className="text-xs text-gray-500">{performer.diamonds.toLocaleString()} diamants</p>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
                            {performer.growth}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="youtube" className="mt-4">
                    <div className="space-y-3">
                      {topPerformers.filter(p => p.category === "YouTube").map((performer, index) => (
                        <div key={performer.id} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10 bg-gradient-to-br from-red-500 to-orange-600">
                                <AvatarFallback>{performer.avatar}</AvatarFallback>
                              </Avatar>
                              {index < 3 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{performer.name}</p>
                              <p className="text-xs text-gray-500">{performer.diamonds.toLocaleString()} vues</p>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
                            {performer.growth}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-200 dark:border-orange-900/30 overflow-hidden">
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
            <motion.div 
              className="text-3xl font-bold"
              animate={{ 
                scale: [1, 1.05, 1],
                color: ["#f97316", "#ea580c", "#f97316"]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              3
            </motion.div>
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
      </motion.div>

      {role === 'creator' && (
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="md:col-span-2 lg:col-span-3"
        >
          <Card className="bg-gradient-to-br from-pink-600/10 to-purple-600/10 border-pink-200 dark:border-pink-900/30 overflow-hidden">
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
        </motion.div>
      )}
    </div>;
};

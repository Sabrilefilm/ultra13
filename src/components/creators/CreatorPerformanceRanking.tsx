
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Diamond, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CreatorPerformanceRankingProps, Creator } from "@/components/training/catalog/types";
import { toast } from "sonner";

export function CreatorPerformanceRanking({ role }: CreatorPerformanceRankingProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hours");

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      
      // Fetch creators with their live schedule data and profile data
      const { data, error } = await supabase
        .from("user_accounts")
        .select(`
          id,
          username,
          role,
          live_schedules (
            hours,
            days
          ),
          profiles (
            total_diamonds
          )
        `)
        .eq("role", "creator");
      
      if (error) {
        throw error;
      }

      // Transform the data to match our Creator interface
      const formattedCreators: Creator[] = data.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        total_hours: user.live_schedules?.[0]?.hours || 0,
        total_days: user.live_schedules?.[0]?.days || 0,
        total_diamonds: user.profiles?.[0]?.total_diamonds || 0,
        // We'll fetch sponsorships separately
        total_sponsorships: 0
      }));

      // Fetch sponsorships count for each creator
      const sponsorshipsPromises = formattedCreators.map(async (creator) => {
        const { count, error: sponsorshipError } = await supabase
          .from("sponsorships")
          .select("*", { count: "exact", head: true })
          .eq("creator_id", creator.id)
          .eq("status", "approved");
        
        if (!sponsorshipError) {
          creator.total_sponsorships = count || 0;
        }
        return creator;
      });

      const creatorsWithSponsorships = await Promise.all(sponsorshipsPromises);
      setCreators(creatorsWithSponsorships);
    } catch (error) {
      console.error("Error fetching creators:", error);
      toast.error("Erreur lors du chargement des créateurs");
    } finally {
      setLoading(false);
    }
  };

  const getSortedCreators = () => {
    switch (activeTab) {
      case "hours":
        return [...creators].sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0));
      case "days":
        return [...creators].sort((a, b) => (b.total_days || 0) - (a.total_days || 0));
      case "diamonds":
        return [...creators].sort((a, b) => (b.total_diamonds || 0) - (a.total_diamonds || 0));
      case "sponsorships":
        return [...creators].sort((a, b) => (b.total_sponsorships || 0) - (a.total_sponsorships || 0));
      default:
        return creators;
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  // Get the top 3 creators for the active category
  const getTopPerformers = () => {
    return getSortedCreators().slice(0, 3);
  };

  const renderIcon = () => {
    switch (activeTab) {
      case "hours":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "days":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "diamonds":
        return <Diamond className="h-5 w-5 text-purple-500" />;
      case "sponsorships":
        return <Award className="h-5 w-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getCardTitle = () => {
    switch (activeTab) {
      case "hours":
        return "Classement par Heures de Live";
      case "days":
        return "Classement par Jours de Streaming";
      case "diamonds":
        return "Classement par Diamants";
      case "sponsorships":
        return "Classement par Parrainages";
      default:
        return "Classement des Créateurs";
    }
  };

  const getValueLabel = () => {
    switch (activeTab) {
      case "hours":
        return "Heures";
      case "days":
        return "Jours";
      case "diamonds":
        return "Diamants";
      case "sponsorships":
        return "Parrainages";
      default:
        return "Valeur";
    }
  };

  const getValueForCreator = (creator: Creator) => {
    switch (activeTab) {
      case "hours":
        return `${creator.total_hours} h`;
      case "days":
        return `${creator.total_days} j`;
      case "diamonds":
        return creator.total_diamonds?.toLocaleString() || "0";
      case "sponsorships":
        return `${creator.total_sponsorships}`;
      default:
        return "0";
    }
  };

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-500 hover:bg-yellow-600"; // Gold
      case 1:
        return "bg-gray-400 hover:bg-gray-500"; // Silver
      case 2:
        return "bg-amber-700 hover:bg-amber-800"; // Bronze
      default:
        return "bg-blue-500 hover:bg-blue-600"; // Default
    }
  };

  return (
    <Card className="border-blue-200 dark:border-blue-900/30 overflow-hidden max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-950">
        <CardTitle className="flex items-center gap-2">
          {renderIcon()}
          <span>Classement des Créateurs Performants</span>
        </CardTitle>
        <CardDescription>
          Retrouvez les meilleurs créateurs classés selon différents critères
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="hours" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Heures</span>
            </TabsTrigger>
            <TabsTrigger value="days" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Jours</span>
            </TabsTrigger>
            <TabsTrigger value="diamonds" className="flex items-center gap-1">
              <Diamond className="h-4 w-4" />
              <span className="hidden sm:inline">Diamants</span>
            </TabsTrigger>
            <TabsTrigger value="sponsorships" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Parrainages</span>
            </TabsTrigger>
          </TabsList>
          
          {/* All tabs share the same content structure */}
          {["hours", "days", "diamonds", "sponsorships"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{getCardTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : creators.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Aucun créateur trouvé
                    </div>
                  ) : (
                    <>
                      {/* Top 3 Performers */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {getTopPerformers().map((creator, index) => (
                          <div key={creator.id} className="flex items-center p-4 border rounded-lg">
                            <div className="relative mr-4">
                              <Avatar className="h-12 w-12 border-2 border-primary">
                                <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                              </Avatar>
                              <Badge 
                                className={`absolute -top-2 -right-2 ${getBadgeColor(index)}`}
                              >
                                #{index + 1}
                              </Badge>
                            </div>
                            <div>
                              <p className="font-bold">{creator.username}</p>
                              <p className="text-sm text-muted-foreground">{getValueForCreator(creator)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Full Ranking Table */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rang</TableHead>
                            <TableHead>Créateur</TableHead>
                            <TableHead className="text-right">{getValueLabel()}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getSortedCreators().map((creator, index) => (
                            <TableRow key={creator.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <Badge className={`mr-2 ${getBadgeColor(index)}`}>
                                    {index + 1}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                                  </Avatar>
                                  {creator.username}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-bold">
                                {getValueForCreator(creator)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

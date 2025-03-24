
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Diamond, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CreatorPerformanceRankingProps, Creator } from "@/components/training/catalog/types";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function CreatorPerformanceRanking({ role }: CreatorPerformanceRankingProps) {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Sort creators by each metric
  const getCreatorsByHours = () => [...creators].sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0));
  const getCreatorsByDays = () => [...creators].sort((a, b) => (b.total_days || 0) - (a.total_days || 0));
  const getCreatorsByDiamonds = () => [...creators].sort((a, b) => (b.total_diamonds || 0) - (a.total_diamonds || 0));
  const getCreatorsBySponsorships = () => [...creators].sort((a, b) => (b.total_sponsorships || 0) - (a.total_sponsorships || 0));

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  // Get the top 3 creators for each category
  const topHours = getCreatorsByHours().slice(0, 3);
  const topDays = getCreatorsByDays().slice(0, 3);
  const topDiamonds = getCreatorsByDiamonds().slice(0, 3);
  const topSponsorships = getCreatorsBySponsorships().slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
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
    <Card className="border-blue-200 dark:border-blue-900/30 overflow-hidden rounded-xl shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-950">
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="text-2xl">🏆</span>
          <span>Classement des Créateurs Performants</span>
        </CardTitle>
        <CardDescription>
          Les meilleurs créateurs dans différentes catégories
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun créateur trouvé
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Top Performers Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Hours Section */}
              <Card className="border-blue-200 dark:border-blue-800/30 overflow-hidden">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Heures de Live</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {topHours.map((creator, index) => (
                      <motion.div 
                        key={`hours-${creator.id}`}
                        className="flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Badge className={`mr-2 ${getBadgeColor(index)}`}>
                          {index + 1}
                        </Badge>
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{creator.username}</p>
                        </div>
                        <p className="font-bold text-blue-600 dark:text-blue-400">{creator.total_hours} h</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Days Section */}
              <Card className="border-green-200 dark:border-green-800/30 overflow-hidden">
                <CardHeader className="bg-green-50 dark:bg-green-900/20 p-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>Jours de Streaming</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {topDays.map((creator, index) => (
                      <motion.div 
                        key={`days-${creator.id}`}
                        className="flex items-center p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Badge className={`mr-2 ${getBadgeColor(index)}`}>
                          {index + 1}
                        </Badge>
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{creator.username}</p>
                        </div>
                        <p className="font-bold text-green-600 dark:text-green-400">{creator.total_days} j</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Diamonds Section */}
              <Card className="border-purple-200 dark:border-purple-800/30 overflow-hidden">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/20 p-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Diamond className="h-4 w-4 text-purple-500" />
                    <span>Diamants</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {topDiamonds.map((creator, index) => (
                      <motion.div 
                        key={`diamonds-${creator.id}`}
                        className="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Badge className={`mr-2 ${getBadgeColor(index)}`}>
                          {index + 1}
                        </Badge>
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{creator.username}</p>
                        </div>
                        <p className="font-bold text-purple-600 dark:text-purple-400">{creator.total_diamonds?.toLocaleString() || "0"}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sponsorships Section */}
              <Card className="border-amber-200 dark:border-amber-800/30 overflow-hidden">
                <CardHeader className="bg-amber-50 dark:bg-amber-900/20 p-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>Parrainages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {topSponsorships.map((creator, index) => (
                      <motion.div 
                        key={`sponsorships-${creator.id}`}
                        className="flex items-center p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                        whileHover={{ x: 5 }}
                      >
                        <Badge className={`mr-2 ${getBadgeColor(index)}`}>
                          {index + 1}
                        </Badge>
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{creator.username}</p>
                        </div>
                        <p className="font-bold text-amber-600 dark:text-amber-400">{creator.total_sponsorships}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Full Ranking Table */}
            <motion.div variants={itemVariants}>
              <Card className="border-blue-200 dark:border-blue-900/30 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-950 p-3">
                  <CardTitle className="text-base">Classement Complet des Créateurs</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Créateur</TableHead>
                        <TableHead className="text-center">
                          <Clock className="h-4 w-4 text-blue-500 inline mr-1" /> 
                          Heures
                        </TableHead>
                        <TableHead className="text-center">
                          <Calendar className="h-4 w-4 text-green-500 inline mr-1" /> 
                          Jours
                        </TableHead>
                        <TableHead className="text-center">
                          <Diamond className="h-4 w-4 text-purple-500 inline mr-1" /> 
                          Diamants
                        </TableHead>
                        <TableHead className="text-center">
                          <Award className="h-4 w-4 text-amber-500 inline mr-1" /> 
                          Parrainages
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creators.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{getInitials(creator.username)}</AvatarFallback>
                              </Avatar>
                              {creator.username}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium text-blue-600 dark:text-blue-400">
                            {creator.total_hours} h
                          </TableCell>
                          <TableCell className="text-center font-medium text-green-600 dark:text-green-400">
                            {creator.total_days} j
                          </TableCell>
                          <TableCell className="text-center font-medium text-purple-600 dark:text-purple-400">
                            {creator.total_diamonds?.toLocaleString() || "0"}
                          </TableCell>
                          <TableCell className="text-center font-medium text-amber-600 dark:text-amber-400">
                            {creator.total_sponsorships}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

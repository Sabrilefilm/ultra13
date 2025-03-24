
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Diamond, Award, Medal, Trophy, Crown } from "lucide-react";
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

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.3 }
    }
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Trophy className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"; // Gold
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 hover:from-gray-400 hover:to-gray-600"; // Silver
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900"; // Bronze
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700"; // Default
    }
  };

  const getCardGradient = (category: string) => {
    switch (category) {
      case "hours":
        return "from-blue-500/10 to-blue-600/5";
      case "days":
        return "from-green-500/10 to-green-600/5";
      case "diamonds":
        return "from-purple-500/10 to-purple-600/5";
      case "sponsorships":
        return "from-amber-500/10 to-amber-600/5";
      default:
        return "from-blue-500/10 to-blue-600/5";
    }
  };

  return (
    <Card className="border-none overflow-hidden rounded-xl shadow-xl bg-gradient-to-br from-indigo-50/60 to-white dark:from-indigo-950/30 dark:to-slate-950/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/30 dark:from-indigo-950/50 dark:to-blue-900/20 p-6 border-b border-blue-200/30 dark:border-blue-800/30">
        <CardTitle className="flex items-center gap-3 text-2xl bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          <motion.span 
            className="text-3xl" 
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.2, 1], 
              rotate: [0, 5, 0, -5, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            🏆
          </motion.span>
          <span>Classement des Créateurs Performants</span>
        </CardTitle>
        <CardDescription className="text-indigo-600/70 dark:text-indigo-300/70 text-base pl-1">
          Les meilleurs créateurs dans différentes catégories
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
              <div className="absolute inset-3 rounded-full border-t-4 border-purple-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
              <div className="absolute inset-6 rounded-full border-t-4 border-blue-500 animate-spin"></div>
            </div>
          </div>
        ) : creators.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-medium">Aucun créateur trouvé</p>
              <p className="mt-2 text-muted-foreground">Les données seront affichées ici dès qu'elles seront disponibles</p>
            </motion.div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Top Performers Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Hours Section */}
              <motion.div 
                whileHover="hover" 
                variants={cardVariants}
              >
                <Card className={`border-blue-200/50 dark:border-blue-800/30 overflow-hidden h-full bg-gradient-to-br ${getCardGradient("hours")} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="bg-blue-50/80 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span>Heures de Live</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {topHours.map((creator, index) => (
                        <motion.div 
                          key={`hours-${creator.id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-blue-50/80 dark:hover:bg-blue-900/20 transition-colors"
                          whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        >
                          <Badge className={`mr-3 ${getBadgeColor(index)} flex items-center justify-center w-8 h-8 rounded-full shadow-md`}>
                            {getMedalIcon(index) || (index + 1)}
                          </Badge>
                          <Avatar className="h-10 w-10 mr-3 ring-2 ring-blue-200 dark:ring-blue-800 bg-gradient-to-br from-blue-400 to-indigo-500">
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">{getInitials(creator.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold truncate">{creator.username}</p>
                          </div>
                          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">{creator.total_hours} h</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Days Section */}
              <motion.div 
                whileHover="hover" 
                variants={cardVariants}
              >
                <Card className={`border-green-200/50 dark:border-green-800/30 overflow-hidden h-full bg-gradient-to-br ${getCardGradient("days")} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="bg-green-50/80 dark:bg-green-900/20 p-4 border-b border-green-100 dark:border-green-800/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <span>Jours de Streaming</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {topDays.map((creator, index) => (
                        <motion.div 
                          key={`days-${creator.id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-green-50/80 dark:hover:bg-green-900/20 transition-colors"
                          whileHover={{ x: 5, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                        >
                          <Badge className={`mr-3 ${getBadgeColor(index)} flex items-center justify-center w-8 h-8 rounded-full shadow-md`}>
                            {getMedalIcon(index) || (index + 1)}
                          </Badge>
                          <Avatar className="h-10 w-10 mr-3 ring-2 ring-green-200 dark:ring-green-800 bg-gradient-to-br from-green-400 to-emerald-500">
                            <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white">{getInitials(creator.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold truncate">{creator.username}</p>
                          </div>
                          <p className="font-bold text-green-600 dark:text-green-400 text-lg">{creator.total_days} j</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Diamonds Section */}
              <motion.div 
                whileHover="hover" 
                variants={cardVariants}
              >
                <Card className={`border-purple-200/50 dark:border-purple-800/30 overflow-hidden h-full bg-gradient-to-br ${getCardGradient("diamonds")} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="bg-purple-50/80 dark:bg-purple-900/20 p-4 border-b border-purple-100 dark:border-purple-800/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Diamond className="h-5 w-5 text-purple-500" />
                      <span>Diamants</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {topDiamonds.map((creator, index) => (
                        <motion.div 
                          key={`diamonds-${creator.id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-purple-50/80 dark:hover:bg-purple-900/20 transition-colors"
                          whileHover={{ x: 5, backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                        >
                          <Badge className={`mr-3 ${getBadgeColor(index)} flex items-center justify-center w-8 h-8 rounded-full shadow-md`}>
                            {getMedalIcon(index) || (index + 1)}
                          </Badge>
                          <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-200 dark:ring-purple-800 bg-gradient-to-br from-purple-400 to-violet-500">
                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-violet-500 text-white">{getInitials(creator.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold truncate">{creator.username}</p>
                          </div>
                          <p className="font-bold text-purple-600 dark:text-purple-400 text-lg">{creator.total_diamonds?.toLocaleString() || "0"}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sponsorships Section */}
              <motion.div 
                whileHover="hover" 
                variants={cardVariants}
              >
                <Card className={`border-amber-200/50 dark:border-amber-800/30 overflow-hidden h-full bg-gradient-to-br ${getCardGradient("sponsorships")} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader className="bg-amber-50/80 dark:bg-amber-900/20 p-4 border-b border-amber-100 dark:border-amber-800/20">
                    <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <Award className="h-5 w-5 text-amber-500" />
                      <span>Parrainages</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {topSponsorships.map((creator, index) => (
                        <motion.div 
                          key={`sponsorships-${creator.id}`}
                          className="flex items-center p-3 rounded-lg hover:bg-amber-50/80 dark:hover:bg-amber-900/20 transition-colors"
                          whileHover={{ x: 5, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                        >
                          <Badge className={`mr-3 ${getBadgeColor(index)} flex items-center justify-center w-8 h-8 rounded-full shadow-md`}>
                            {getMedalIcon(index) || (index + 1)}
                          </Badge>
                          <Avatar className="h-10 w-10 mr-3 ring-2 ring-amber-200 dark:ring-amber-800 bg-gradient-to-br from-amber-400 to-orange-500">
                            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">{getInitials(creator.username)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold truncate">{creator.username}</p>
                          </div>
                          <p className="font-bold text-amber-600 dark:text-amber-400 text-lg">{creator.total_sponsorships}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Full Ranking Table */}
            <motion.div variants={itemVariants}>
              <Card className="border-blue-200/50 dark:border-blue-900/30 overflow-hidden shadow-lg bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-100/50 to-blue-100/30 dark:from-indigo-950/50 dark:to-blue-900/20 p-4 border-b border-blue-200/30 dark:border-blue-800/30">
                  <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                    <Trophy className="h-5 w-5 text-indigo-500" />
                    <span>Classement Complet des Créateurs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="overflow-x-auto rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-indigo-50/80 dark:bg-indigo-950/30">
                          <TableHead className="font-semibold text-indigo-700 dark:text-indigo-300">Créateur</TableHead>
                          <TableHead className="text-center font-semibold text-blue-700 dark:text-blue-300">
                            <Clock className="h-4 w-4 text-blue-500 inline mr-1" /> 
                            Heures
                          </TableHead>
                          <TableHead className="text-center font-semibold text-green-700 dark:text-green-300">
                            <Calendar className="h-4 w-4 text-green-500 inline mr-1" /> 
                            Jours
                          </TableHead>
                          <TableHead className="text-center font-semibold text-purple-700 dark:text-purple-300">
                            <Diamond className="h-4 w-4 text-purple-500 inline mr-1" /> 
                            Diamants
                          </TableHead>
                          <TableHead className="text-center font-semibold text-amber-700 dark:text-amber-300">
                            <Award className="h-4 w-4 text-amber-500 inline mr-1" /> 
                            Parrainages
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creators.map((creator, index) => (
                          <motion.tr
                            key={creator.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-indigo-100/20 dark:border-indigo-800/20 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
                          >
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-9 w-9 mr-3 ring-1 ring-indigo-200 dark:ring-indigo-800 bg-gradient-to-br from-indigo-400 to-purple-500">
                                  <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">{getInitials(creator.username)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{creator.username}</span>
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
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

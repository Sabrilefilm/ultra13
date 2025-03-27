
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedTitle } from "./community/AnimatedTitle";
import { CommunityLinks } from "./community/CommunityLinks";
import { LogOutButton } from "./community/LogOutButton";

interface SocialCommunityProps {
  className?: string;
  onLogout?: () => void;
  compact?: boolean; // Nouvelle prop pour rendre le composant plus compact
}

export const SocialCommunityLinks = ({ className = "", onLogout, compact = false }: SocialCommunityProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay for the animation to start
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  return (
    <Card className={`rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-950 via-violet-950 to-purple-950 border-purple-800/30 ${className} ${compact ? 'scale-95 opacity-80 hover:opacity-100 transition-all' : ''}`}>
      <CardHeader className={`pb-2 ${compact ? 'pt-3 px-4' : 'pt-6 px-6'} bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-purple-800/20`}>
        <CardTitle className={`${compact ? 'text-base' : 'text-xl'} flex items-center gap-2 text-white`}>
          <AnimatedTitle text="Rejoindre notre communauté" />
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'p-3' : 'p-6'}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-3"
        >
          <CommunityLinks isVisible={isVisible} compact={compact} />
          
          {!compact && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ delay: 1 }}
              className="text-center mt-4 text-purple-300/90 text-sm"
            >
              Rejoignez-nous sur nos réseaux pour ne manquer aucune information importante et participer à notre communauté !
            </motion.p>
          )}
          
          {onLogout && !compact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: 1.5 }}
              className="flex justify-center mt-8"
            >
              <LogOutButton onLogout={onLogout} />
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

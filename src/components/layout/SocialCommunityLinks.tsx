
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CommunityLinks } from "./community/CommunityLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronRight, ChevronDown } from "lucide-react";

interface SocialCommunityLinksProps {
  compact?: boolean;
  className?: string; // Add className prop to the interface
}

export const SocialCommunityLinks: React.FC<SocialCommunityLinksProps> = ({ 
  compact = false,
  className = '' // Set default value for the className prop
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-100 dark:border-blue-900/20 overflow-hidden ${compact ? 'shadow-sm' : 'shadow-md'} ${className}`}>
      <CardHeader 
        className={`pb-2 cursor-pointer ${compact ? 'py-2' : 'py-4'}`} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className={`flex items-center justify-between ${compact ? 'text-base' : 'text-lg'}`}>
          <div className="flex items-center gap-2">
            <Users className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-blue-500`} />
            <span className="text-blue-800 dark:text-blue-300">
              {compact ? 'Rejoindre la communauté' : 'Rejoindre notre communauté'}
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-blue-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-blue-500" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${compact ? 'p-3' : 'p-5'} overflow-hidden`}>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <CommunityLinks isVisible={isExpanded} compact={compact} />
        </motion.div>
      </CardContent>
    </Card>
  );
};

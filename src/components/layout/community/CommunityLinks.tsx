
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCommunityLinks } from "./communityData";
import { CommunityLinkButton } from "./CommunityLinkButton";

interface CommunityLinksProps {
  isVisible: boolean;
  compact?: boolean;
}

export const CommunityLinks: React.FC<CommunityLinksProps> = ({ 
  isVisible,
  compact = false 
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const links = getCommunityLinks();

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {links.map((link, index) => (
        <motion.div 
          key={index} 
          variants={itemVariants}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          className="relative"
        >
          <CommunityLinkButton 
            {...link}
            isHovered={hoverIndex === index}
            compact={compact}
          />
        </motion.div>
      ))}
    </div>
  );
};

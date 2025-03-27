
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CommunityLinkButtonProps {
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  label: string;
  url: string;
  isHovered: boolean;
  compact?: boolean;
}

export const CommunityLinkButton: React.FC<CommunityLinkButtonProps> = ({
  icon: Icon,
  color,
  hoverColor,
  label,
  url,
  isHovered,
  compact = false
}) => {
  const buttonVariants = {
    rest: { backgroundColor: `${color}20` },
    hover: { backgroundColor: `${hoverColor}30` },
  };

  const textVariants = {
    rest: { x: 0 },
    hover: { x: 5 },
  };

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={buttonVariants}
      initial="rest"
      animate={isHovered ? "hover" : "rest"}
      className={`flex items-center gap-3 ${compact ? 'py-2 px-3' : 'py-3 px-4'} rounded-lg border border-white/10 transition-all`}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={`${isHovered ? hoverColor : color} rounded-md ${compact ? 'p-1.5' : 'p-2'}`}>
        <Icon className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
      </div>
      
      <motion.span 
        variants={textVariants}
        className={`${compact ? 'text-sm' : 'text-base'} font-medium text-white flex-1`}
      >
        {label}
      </motion.span>
      
      <motion.div
        animate={{
          x: isHovered ? 5 : 0,
          opacity: isHovered ? 1 : 0.7,
        }}
        className={`${isHovered ? hoverColor : color} ${compact ? 'text-xs' : 'text-sm'}`}
      >
        →
      </motion.div>
    </motion.a>
  );
};

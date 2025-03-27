
import React, { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface CommunityLinkButtonProps {
  name: string;
  url: string;
  bgColor: string;
  textColor: string;
  icon: ReactNode;
  shadowColor: string;
  hoverBg: string;
  isHovered: boolean;
}

export const CommunityLinkButton = ({
  name,
  url,
  bgColor,
  textColor,
  icon,
  shadowColor,
  hoverBg,
  isHovered
}: CommunityLinkButtonProps) => {
  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const iconVariants: Variants = {
    rest: { y: 0, rotate: 0 },
    hover: { 
      y: [-2, 2, -2], 
      rotate: [-5, 5, -5, 5, 0],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        repeatType: "loop"
      } 
    }
  };

  const textVariants: Variants = {
    rest: { x: 0 },
    hover: { 
      x: [0, 3, 0], 
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const glowVariants: Variants = {
    rest: { opacity: 0, scale: 0.8 },
    hover: { 
      opacity: [0.5, 0.7, 0.5], 
      scale: 1.2,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  return (
    <div className="relative">
      {/* Button */}
      <motion.div
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        className="relative z-10 overflow-hidden rounded-full"
      >
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block w-full h-full"
        >
          <Button 
            variant="outline"
            className={`w-full py-6 bg-gradient-to-r ${bgColor} ${hoverBg} hover:shadow-lg transition-all duration-300 ${textColor} border-none rounded-full shadow-md ${shadowColor}`}
          >
            <div className="flex items-center justify-center gap-4 z-10 relative">
              <motion.div variants={iconVariants}>
                {icon}
              </motion.div>
              <motion.span className="text-lg font-bold">{name}</motion.span>
              <motion.div 
                variants={textVariants}
                className="flex items-center text-xs gap-1 opacity-90"
              >
                <span>Rejoindre</span>
                <ExternalLink className="h-3 w-3" />
              </motion.div>
            </div>
            
            {/* Background animation */}
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-white/10"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.2, 0],
                  scale: [0.8, 1.5],
                  transition: { duration: 1.5, repeat: Infinity }
                }}
                exit={{ opacity: 0, scale: 0 }}
              />
            )}
          </Button>
        </a>
      </motion.div>
      
      {/* Glow effect behind button */}
      <motion.div 
        className="absolute inset-0 rounded-full blur-xl z-0"
        initial="rest"
        animate={isHovered ? "hover" : "rest"}
        variants={glowVariants}
        style={{ 
          background: `linear-gradient(to right, ${
            name === "WhatsApp" ? 'rgb(52, 211, 153), rgb(22, 163, 74)' : 
            name === "Snapchat" ? 'rgb(253, 224, 71), rgb(234, 179, 8)' : 
            'rgb(64, 64, 64), rgb(23, 23, 23)'
          })`
        }}
      />
    </div>
  );
};

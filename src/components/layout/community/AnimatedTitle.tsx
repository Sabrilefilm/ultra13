
import React from "react";
import { motion } from "framer-motion";

interface AnimatedTitleProps {
  text: string;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text }) => {
  return (
    <div className="flex items-center gap-2 text-white">
      <motion.span 
        className="text-2xl relative" 
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        ⭐
        <motion.span 
          className="absolute top-0 left-0 w-full h-full bg-white rounded-full blur-xl"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.span>
      <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">{text}</span>
    </div>
  );
};

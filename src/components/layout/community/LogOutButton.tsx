
import React from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LogOutButtonProps {
  onLogout: () => void;
}

export const LogOutButton = ({ onLogout }: LogOutButtonProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    // Rediriger vers la page d'authentification après la déconnexion
    navigate("/");
  };
  
  const buttonVariants: Variants = {
    rest: { 
      scale: 1,
      backgroundColor: "rgba(139, 92, 246, 0.15)" 
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "rgba(139, 92, 246, 0.3)",
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.95,
      backgroundColor: "rgba(139, 92, 246, 0.4)",
      transition: {
        duration: 0.1
      }
    }
  };

  const iconVariants: Variants = {
    rest: { rotate: 0 },
    hover: { 
      rotate: [0, -10, 10, -10, 0],
      transition: { 
        duration: 1, 
        repeat: Infinity, 
        repeatType: "loop"
      } 
    }
  };

  return (
    <motion.div
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="overflow-hidden"
    >
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-16 h-16 rounded-lg p-0 bg-gradient-to-r from-purple-800/20 to-indigo-800/20 border border-purple-500/30 hover:shadow-glow hover:shadow-purple-500/20"
      >
        <motion.div
          className="flex flex-col items-center justify-center gap-1"
          variants={iconVariants}
        >
          <LogOut className="h-6 w-6 text-purple-300" />
          <span className="text-xs font-medium text-purple-300">Quitter</span>
        </motion.div>
      </Button>
    </motion.div>
  );
};

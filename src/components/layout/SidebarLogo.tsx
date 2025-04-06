
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarLogoProps {
  collapsed?: boolean;
}

export const SidebarLogo = ({
  collapsed = false
}: SidebarLogoProps) => {
  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Rocket className="h-8 w-8 text-purple-500" />
        <motion.div 
          className="absolute inset-0 bg-purple-500 rounded-full filter blur-xl opacity-30"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </motion.div>
      
      {!collapsed && (
        <div className="ml-3 flex flex-col">
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            ULTRA 🚀
          </span>
          <span className="text-xs text-slate-400">by Phocéen Agency</span>
        </div>
      )}
    </div>
  );
};

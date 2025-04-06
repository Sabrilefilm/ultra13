
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SidebarLogo } from "@/components/layout/SidebarLogo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 max-w-md mx-auto"
      >
        <div className="flex justify-center mb-4">
          <SidebarLogo collapsed={false} />
        </div>

        <div className="flex justify-center">
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <AlertOctagon className="h-24 w-24 text-red-500" />
          </motion.div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-7xl font-bold bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Oups !
          </h1>
          
          <p className="text-xl text-slate-300">
            Cette page n'est pas disponible ou vous n'avez pas les droits nécessaires pour y accéder.
          </p>
          
          <p className="text-sm text-slate-400">
            Veuillez vous connecter pour accéder à tout le contenu.
          </p>
        </div>

        <Button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
          size="lg"
        >
          Retour à l'accueil
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;

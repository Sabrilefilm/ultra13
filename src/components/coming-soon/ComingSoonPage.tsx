
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Home, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ComingSoonPageProps {
  title: string;
  icon?: React.ReactNode;
  redirectSeconds?: number;
  description?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  title,
  icon = <MessageSquare className="h-16 w-16 text-purple-400" />,
  redirectSeconds = 10,
  description = "Cette fonctionnalité sera bientôt disponible."
}) => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(redirectSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, redirectSeconds]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-slate-800/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-purple-500/20"
      >
        <div className="text-center space-y-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mx-auto"
          >
            {icon}
          </motion.div>
          
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          
          <p className="text-slate-300">{description}</p>
          
          <div className="relative mt-8 pt-4 text-center border-t border-slate-700">
            <div className="flex items-center justify-center gap-2 text-purple-300 mb-6">
              <Clock className="h-5 w-5 animate-pulse" />
              <span>Redirection dans {seconds} secondes</span>
            </div>
            
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: `${(seconds / redirectSeconds) * 100}%` }}
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            />
            
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-slate-500 text-sm">
        © Ultra Agency - {new Date().getFullYear()}
      </div>
    </motion.div>
  );
};

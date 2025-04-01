
import React, { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { useIndexAuth } from "@/hooks/use-index-auth";
import { MessageSquare, Home, Clock, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Messages = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, username, userId, handleLogout } = useIndexAuth();
  const [countdown, setCountdown] = useState(59);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Set up countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, navigate]);

  const usernameWatermark = (
    <div className="fixed inset-0 pointer-events-none select-none z-0 flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center rotate-[-30deg]">
        <p className="text-slate-200/10 text-[6vw] font-bold whitespace-nowrap">
          {username?.toUpperCase()}
        </p>
      </div>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white flex">
        {usernameWatermark}
        
        <UltraSidebar 
          username={username || ''}
          role={role || ''}
          userId={userId || ''}
          onLogout={handleLogout}
          currentPage="messages"
        />
        
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg w-full"
            >
              <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-900/30 text-center shadow-xl">
                <CardHeader className="pb-2">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <MessageSquare className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-2xl font-bold text-white">
                    ✨ Messagerie Ultra Agency ✨
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <motion.p 
                    className="text-slate-300"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Notre système de messagerie interne sera bientôt disponible. 
                    Vous pourrez communiquer avec les créateurs, agents et managers directement depuis la plateforme.
                  </motion.p>
                  
                  <div className="my-6 flex justify-center items-center">
                    <motion.div 
                      className="flex items-center justify-center bg-purple-900/30 rounded-full p-3 w-20 h-20 border border-purple-500/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <motion.div 
                        className="flex items-center justify-center bg-purple-800/50 rounded-full p-2 w-16 h-16"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Clock className="h-8 w-8 text-purple-300" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="text-lg font-semibold text-purple-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    Redirection dans {countdown} secondes...
                  </motion.div>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={() => navigate("/")} 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Retour à l'accueil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Messages;

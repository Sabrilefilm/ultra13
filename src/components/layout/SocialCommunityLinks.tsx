
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface SocialCommunityProps {
  className?: string;
}

export const SocialCommunityLinks = ({ className = "" }: SocialCommunityProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay for the animation to start
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const links = [
    {
      name: "WhatsApp",
      url: "https://chat.whatsapp.com/CW5td9nAqOR9P058nwi7Ft",
      color: "from-green-500 to-green-700",
      textColor: "text-white",
      emoji: "💬"
    },
    {
      name: "Snapchat",
      url: "https://snapchat.com/t/pyOCbCrj",
      color: "from-yellow-300 to-yellow-500",
      textColor: "text-gray-900",
      emoji: "👻"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@phoceen_agency",
      color: "from-black to-gray-800",
      textColor: "text-white",
      emoji: "🎵"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <Card className={`rounded-xl overflow-hidden shadow-md bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-800/30 ${className}`}>
      <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-purple-800/20">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <span className="text-2xl">🌐</span> Rejoindre notre communauté
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {links.map((link, index) => (
            <motion.div key={index} variants={itemVariants}>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-full h-full"
              >
                <Button 
                  variant="outline"
                  className={`w-full h-full py-6 px-4 bg-gradient-to-r ${link.color} hover:shadow-lg hover:scale-105 transition-all duration-300 ${link.textColor} border-none`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">{link.emoji}</span>
                    <span className="text-lg font-bold">{link.name}</span>
                    <div className="flex items-center text-xs gap-1 mt-1 opacity-80">
                      <span>Rejoindre</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </Button>
              </a>
            </motion.div>
          ))}
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-purple-300/70 text-sm"
        >
          Rejoignez-nous sur nos réseaux pour ne manquer aucune information importante et participer à notre communauté !
        </motion.p>
      </CardContent>
    </Card>
  );
};

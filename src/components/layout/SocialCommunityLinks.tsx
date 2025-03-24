
import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle, Send, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SocialCommunityProps {
  className?: string;
}

export const SocialCommunityLinks = ({ className = "" }: SocialCommunityProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const navigate = useNavigate();

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
      bgColor: "from-emerald-400 to-green-600",
      textColor: "text-white",
      icon: <MessageCircle className="h-6 w-6" />,
      shadowColor: "shadow-green-500/30",
      hoverBg: "hover:from-emerald-500 hover:to-green-700"
    },
    {
      name: "Snapchat",
      url: "https://snapchat.com/t/pyOCbCrj",
      bgColor: "from-yellow-300 to-yellow-500",
      textColor: "text-gray-900",
      icon: <Send className="h-6 w-6" />,
      shadowColor: "shadow-yellow-500/30",
      hoverBg: "hover:from-yellow-400 hover:to-yellow-600"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@phoceen_agency",
      bgColor: "from-neutral-800 to-gray-900",
      textColor: "text-white",
      icon: <MessageSquare className="h-6 w-6" />,
      shadowColor: "shadow-gray-800/30",
      hoverBg: "hover:from-neutral-900 hover:to-black"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

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

  const buttonVariants = {
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
        repeatType: "loop" as const
      } 
    }
  };

  const textVariants = {
    rest: { x: 0 },
    hover: { 
      x: [0, 3, 0], 
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  const glowVariants = {
    rest: { opacity: 0, scale: 0.8 },
    hover: { 
      opacity: [0.5, 0.7, 0.5], 
      scale: 1.2,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  return (
    <Card className={`rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-950 via-violet-950 to-purple-950 border-purple-800/30 ${className}`}>
      <CardHeader className="pb-2 pt-6 px-6 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-b border-purple-800/20">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
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
          <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Rejoindre notre communauté</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-4">
            {links.map((link, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className="relative"
              >
                {/* Message App Button */}
                <motion.div
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="relative z-10 overflow-hidden rounded-full"
                >
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full h-full"
                  >
                    <Button 
                      variant="outline"
                      className={`w-full py-6 bg-gradient-to-r ${link.bgColor} ${link.hoverBg} hover:shadow-lg transition-all duration-300 ${link.textColor} border-none rounded-full shadow-md ${link.shadowColor}`}
                    >
                      <div className="flex items-center justify-center gap-4 z-10 relative">
                        <motion.div variants={iconVariants}>
                          {link.icon}
                        </motion.div>
                        <motion.span className="text-lg font-bold">{link.name}</motion.span>
                        <motion.div 
                          variants={textVariants}
                          className="flex items-center text-xs gap-1 opacity-90"
                        >
                          <span>Rejoindre</span>
                          <ExternalLink className="h-3 w-3" />
                        </motion.div>
                      </div>
                      
                      {/* Background animation */}
                      <AnimatePresence>
                        {hoverIndex === index && (
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
                      </AnimatePresence>
                    </Button>
                  </a>
                </motion.div>
                
                {/* Glow effect behind button */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-xl z-0"
                  initial="rest"
                  animate={hoverIndex === index ? "hover" : "rest"}
                  variants={glowVariants}
                  style={{ 
                    background: `linear-gradient(to right, ${
                      index === 0 ? 'rgb(52, 211, 153), rgb(22, 163, 74)' : 
                      index === 1 ? 'rgb(253, 224, 71), rgb(234, 179, 8)' : 
                      'rgb(64, 64, 64), rgb(23, 23, 23)'
                    })`
                  }}
                />
              </motion.div>
            ))}
            
            {/* Messagerie Button */}
            <motion.div
              variants={itemVariants}
              className="relative mt-2"
            >
              <motion.div
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="relative z-10 overflow-hidden rounded-full"
              >
                <Button 
                  variant="outline"
                  onClick={() => navigate("/messages")}
                  className="w-full py-6 bg-gradient-to-r from-indigo-400 to-purple-600 hover:from-indigo-500 hover:to-purple-700 text-white border-none rounded-full shadow-md shadow-purple-500/30"
                >
                  <div className="flex items-center justify-center gap-3 z-10 relative">
                    <motion.div 
                      initial={{ y: 0 }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <MessageCircle className="h-6 w-6" />
                    </motion.div>
                    <span className="text-lg font-bold">Messagerie Interne</span>
                  </div>
                  
                  {/* Subtle animation for the button */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ 
                      x: ['-100%', '200%'],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut"
                    }}
                  />
                </Button>
              </motion.div>
              
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-full blur-xl z-0 bg-gradient-to-r from-indigo-400 to-purple-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0.2, 0.4, 0.2],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-4 text-purple-300/90 text-sm"
          >
            Rejoignez-nous sur nos réseaux pour ne manquer aucune information importante et participer à notre communauté !
          </motion.p>
        </motion.div>
      </CardContent>
    </Card>
  );
};

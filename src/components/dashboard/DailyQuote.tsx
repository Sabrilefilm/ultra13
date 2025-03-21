
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

const quotes = [
  {
    text: "Le streaming est plus qu'un hobby, c'est une passion qui rapproche des personnes du monde entier.",
    author: "Ultra Agency",
    category: "streaming"
  },
  {
    text: "La musique est la bande-son de notre vie, elle rend nos streams plus vivants et mémorables.",
    author: "Ultra Team",
    category: "music"
  },
  {
    text: "Les jeux ne sont pas seulement une façon de s'amuser, mais aussi une façon de créer des liens et des communautés.",
    author: "Phocéen Agency",
    category: "gaming"
  },
  {
    text: "Le contenu original est votre signature unique dans l'océan du contenu en ligne.",
    author: "Ultra Creator",
    category: "content"
  },
  {
    text: "Chaque live est une opportunité de créer quelque chose de spécial pour votre communauté.",
    author: "Ultra Team",
    category: "streaming"
  },
  {
    text: "Les meilleurs streamers ne sont pas ceux qui ont le plus de vues, mais ceux qui créent les connexions les plus authentiques.",
    author: "Phocéen Agency",
    category: "streaming"
  },
  {
    text: "Le gaming n'est pas juste un loisir, c'est un langage universel qui traverse les cultures.",
    author: "Ultra Gaming",
    category: "gaming"
  },
  {
    text: "La musique a le pouvoir de transformer l'ambiance de votre stream en quelque chose de magique.",
    author: "Ultra Music",
    category: "music"
  },
  {
    text: "Rester authentique est la clé pour bâtir une communauté fidèle et engagée.",
    author: "Ultra Creator",
    category: "content"
  },
  {
    text: "Chaque échec en streaming est une leçon qui vous rapproche du succès.",
    author: "Ultra Agency",
    category: "streaming"
  },
  {
    text: "Les jeux compétitifs nous enseignent la persévérance et l'esprit d'équipe.",
    author: "Phocéen Gaming",
    category: "gaming"
  },
  {
    text: "La constance est plus importante que la perfection dans votre parcours de créateur.",
    author: "Ultra Team",
    category: "content"
  }
];

export const DailyQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  // Change quote every 15 minutes
  useEffect(() => {
    // Initial random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuoteIndex(randomIndex);
    setCurrentQuote(quotes[randomIndex]);
    
    // Update quote every 15 minutes (900000 ms)
    const intervalId = setInterval(() => {
      const nextIndex = (quoteIndex + 1) % quotes.length;
      setQuoteIndex(nextIndex);
      setCurrentQuote(quotes[nextIndex]);
    }, 900000); // 15 minutes
    
    return () => clearInterval(intervalId);
  }, [quoteIndex]);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "streaming":
        return "from-purple-500 to-indigo-600";
      case "gaming":
        return "from-red-500 to-orange-600";
      case "music":
        return "from-blue-500 to-cyan-600";
      case "content":
        return "from-emerald-500 to-teal-600";
      default:
        return "from-purple-500 to-indigo-600";
    }
  };
  
  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-purple-900/20 rounded-xl shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(currentQuote.category)} flex-shrink-0`}>
            <QuoteIcon className="h-5 w-5 text-white" />
          </div>
          
          <div>
            <blockquote className="text-white/90 italic mb-2 text-lg leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <footer className="text-sm text-white/60">
              — <cite>{currentQuote.author}</cite>
            </footer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

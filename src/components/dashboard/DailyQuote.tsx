
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const quotes = [
  {
    text: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.",
    author: "Gandhi"
  },
  {
    text: "Le bonheur n'est pas au bout du chemin, il est le chemin.",
    author: "Bouddha"
  },
  {
    text: "Soyez le changement que vous voulez voir dans le monde.",
    author: "Gandhi"
  },
  {
    text: "Le succès c'est d'aller d'échec en échec sans perdre son enthousiasme.",
    author: "Winston Churchill"
  },
  {
    text: "La joie est en tout ; il faut savoir l'extraire.",
    author: "Confucius"
  },
  {
    text: "La vie est vraiment simple, mais nous insistons à la rendre compliquée.",
    author: "Confucius"
  },
  {
    text: "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute.",
    author: "Nelson Mandela"
  },
  {
    text: "Le bonheur est la seule chose qui se double si on le partage.",
    author: "Albert Schweitzer"
  },
  {
    text: "Vis comme si tu devais mourir demain. Apprends comme si tu devais vivre toujours.",
    author: "Gandhi"
  },
  {
    text: "Ce n'est pas parce que les choses sont difficiles que nous n'osons pas, c'est parce que nous n'osons pas qu'elles sont difficiles.",
    author: "Sénèque"
  }
];

export const DailyQuote = () => {
  const [quote, setQuote] = useState({ text: "", author: "" });
  
  useEffect(() => {
    // Get the current date
    const today = new Date().toLocaleDateString();
    
    // Use the date as a seed to select a quote
    const hash = today.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    const index = hash % quotes.length;
    setQuote(quotes[index]);
  }, []);

  if (!quote.text) return null;

  return (
    <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-900/50 shadow-md overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start">
          <Sparkles className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2 mt-1 flex-shrink-0" />
          <div>
            <p className="italic text-gray-700 dark:text-gray-300">"{quote.text}"</p>
            <p className="text-right mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">— {quote.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BackButton } from "@/components/ui/back-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-accent/10 p-4">
      <div className="text-center space-y-6 animate-fadeIn">
        <div className="flex justify-center mb-4">
          <BackButton />
        </div>
        <h1 className="text-8xl font-bold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-muted-foreground">
          Oops! La page que vous recherchez n'existe pas.
        </p>
        <a 
          href="/" 
          className="inline-block text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  Rocket, 
  Mail, 
  Lock, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Star
} from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  onLogin,
  onForgotPassword
}: LoginFormProps) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Animation de démarrage
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      setError("Veuillez saisir votre identifiant");
      return;
    }
    if (!password.trim()) {
      setError("Veuillez saisir votre mot de passe");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Animation des étoiles flottantes
  const renderStars = () => {
    return Array(8).fill(0).map((_, i) => (
      <div 
        key={i} 
        className={`absolute text-purple-300/20 dark:text-purple-500/20 animate-ping-slow z-0
          ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower'}`}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.5}s`,
          transform: `scale(${0.5 + Math.random() * 0.5})`,
          opacity: 0.3 + Math.random() * 0.7
        }}
      >
        {i % 2 === 0 ? 
          <Sparkles className="w-6 h-6" /> : 
          <Star className="w-5 h-5" />
        }
      </div>
    ));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 text-white p-4 relative overflow-hidden">
      {/* Logo Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <p className="text-slate-200/5 text-[15vw] font-bold rotate-[-10deg] transform">
          ULTRA
        </p>
      </div>
      
      {/* Animations de fond */}
      <div className="absolute inset-0 overflow-hidden">
        {renderStars()}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <div 
          className={`text-center space-y-6 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.1s' }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2 relative">
              <div className="relative">
                <Rocket className="w-14 h-14 text-purple-500 animate-pulse" />
                <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-xl opacity-30 animate-ping"></div>
              </div>
              <div className="relative">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-400 bg-clip-text text-transparent neon-text">ULTRA</h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-indigo-400/20 blur-xl opacity-30 rounded-lg"></div>
              </div>
            </div>
            <p className="text-xl bg-gradient-to-br from-white via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
              L'AGENCE PHOCÉEN
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white/90">
              Espace de travail
            </h2>
            <p className="text-sm text-white/60">
              Connectez-vous pour accéder à votre tableau de bord
            </p>
          </div>
        </div>

        <div 
          className={`bg-slate-800/50 backdrop-blur-lg rounded-xl p-8 space-y-6 shadow-xl border border-slate-700/50 relative overflow-hidden transition-all duration-700 
          ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.3s' }}
        >
          {/* Background graphic elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                Identifiant
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Rocket className="h-5 w-5 text-white/40" />
                </div>
                <Input id="username" type="text" placeholder="Votre identifiant" value={username} onChange={e => setUsername(e.target.value)} onKeyPress={handleKeyPress} className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-white/40 h-12 pl-10" autoComplete="username" disabled={isLoading} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Mot de passe
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/40" />
                </div>
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress} className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-white/40 h-12 pl-10 pr-10" autoComplete="current-password" disabled={isLoading} />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/40 hover:text-white/60" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <Button variant="link" className="text-sm text-white/60 hover:text-purple-400 p-0" onClick={onForgotPassword} type="button" disabled={isLoading}>
                Mot de passe oublié ?
              </Button>
              <Button variant="link" className="text-sm text-white/60 hover:text-purple-400 p-0" onClick={() => window.location.href = 'mailto:Contact@Phoceenagency.fr'} type="button" disabled={isLoading}>
                Contacter le support
              </Button>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 flex items-center justify-center group transition-all shadow-lg shadow-purple-900/20" disabled={isLoading} type="submit">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <>
                  <span>Se connecter</span>
                  <ChevronRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </>}
            </Button>
          </form>

          <div 
            className={`flex items-center justify-center transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.5s' }}
          >
            <Link to="/external-matches" className="text-sm text-center text-white/60 hover:text-purple-400 flex items-center gap-1">
              <span>Accéder aux matchs externes</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

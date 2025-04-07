
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  Rocket, 
  Lock, 
  Loader2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Star,
  AlertTriangle
} from "lucide-react";
import { useState, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";

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
  const [loginAttempts, setLoginAttempts] = useState(() => {
    const attempts = localStorage.getItem('loginAttempts');
    return attempts ? parseInt(attempts) : 0;
  });
  const [lastAttemptTime, setLastAttemptTime] = useState(() => {
    const time = localStorage.getItem('lastAttemptTime');
    return time ? parseInt(time) : 0;
  });
  const [lockoutEndTime, setLockoutEndTime] = useState(() => {
    const time = localStorage.getItem('lockoutEndTime');
    return time ? parseInt(time) : 0;
  });
  const [remainingAttempts, setRemainingAttempts] = useState(5);
  const [countdownTimer, setCountdownTimer] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is locked out
    const now = Date.now();
    
    if (lockoutEndTime > now) {
      const timeLeft = Math.ceil((lockoutEndTime - now) / 1000 / 60); // minutes
      const secondsLeft = Math.ceil((lockoutEndTime - now) / 1000) % 60;
      setError(`Compte temporairement bloqué. Réessayez dans ${timeLeft}m ${secondsLeft}s`);
    } else if (lockoutEndTime > 0 && now > lockoutEndTime) {
      // Reset lockout if it's expired
      localStorage.removeItem('lockoutEndTime');
      localStorage.removeItem('loginAttempts');
      setLockoutEndTime(0);
      setLoginAttempts(0);
      setRemainingAttempts(5);
    }

    // Calculate remaining attempts
    setRemainingAttempts(5 - loginAttempts);

    // Animation de démarrage
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [lockoutEndTime, loginAttempts]);

  // Update countdown timer every second
  useEffect(() => {
    if (lockoutEndTime <= Date.now()) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (lockoutEndTime > now) {
        const minutes = Math.floor((lockoutEndTime - now) / 1000 / 60);
        const seconds = Math.floor((lockoutEndTime - now) / 1000) % 60;
        setCountdownTimer(`${minutes}m ${seconds.toString().padStart(2, '0')}s`);
      } else {
        setCountdownTimer(null);
        clearInterval(interval);
        // Reset lockout
        localStorage.removeItem('lockoutEndTime');
        localStorage.removeItem('loginAttempts');
        setLockoutEndTime(0);
        setLoginAttempts(0);
        setRemainingAttempts(5);
        setError(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutEndTime]);

  const handleLoginAttempt = (success: boolean) => {
    const now = Date.now();
    
    if (success) {
      // Reset attempts on successful login
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lastAttemptTime');
      localStorage.removeItem('lockoutEndTime');
      setLoginAttempts(0);
      return;
    }
    
    // If the last attempt was more than 30 minutes ago, reset attempts
    if (now - lastAttemptTime > 30 * 60 * 1000) {
      setLoginAttempts(1);
    } else {
      setLoginAttempts(loginAttempts + 1);
    }
    
    setLastAttemptTime(now);
    localStorage.setItem('loginAttempts', (loginAttempts + 1).toString());
    localStorage.setItem('lastAttemptTime', now.toString());
    
    // Set lockout based on number of attempts
    if (loginAttempts + 1 >= 5) {
      let lockoutTime = 5 * 60 * 1000; // 5 minutes
      
      if (loginAttempts + 1 >= 10) {
        lockoutTime = 15 * 60 * 1000; // 15 minutes
      }
      if (loginAttempts + 1 >= 15) {
        lockoutTime = 60 * 60 * 1000; // 1 hour
      }
      if (loginAttempts + 1 >= 20) {
        lockoutTime = 24 * 60 * 60 * 1000; // 24 hours
      }
      
      const lockoutEnd = now + lockoutTime;
      localStorage.setItem('lockoutEndTime', lockoutEnd.toString());
      setLockoutEndTime(lockoutEnd);
      
      const timeLeft = Math.ceil(lockoutTime / 1000 / 60); // minutes
      setError(`Trop de tentatives. Compte bloqué pendant ${timeLeft} minutes.`);
    }
    
    setRemainingAttempts(5 - (loginAttempts + 1));
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    // Check if user is locked out
    if (lockoutEndTime > Date.now()) {
      return;
    }
    
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
      handleLoginAttempt(true);
    } catch (err) {
      console.error("Login error:", err);
      handleLoginAttempt(false);
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
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30 bg-fixed">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
        </div>
        <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full filter blur-[80px] bg-purple-600/20"></div>
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full filter blur-[80px] bg-indigo-600/20"></div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden">
        {renderStars()}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full -mr-36 -mt-36 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full -ml-36 -mb-36 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        <div 
          className={`text-center space-y-6 transition-all duration-700 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.1s' }}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex flex-col items-center relative animate-float-slow">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-purple-500/30 rounded-full filter blur-xl animate-pulse"></div>
                <Rocket className="w-16 h-16 text-purple-400 relative z-10" />
              </div>
              <div className="relative">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">ULTRA</h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/10 to-indigo-400/20 blur-xl opacity-30 rounded-lg"></div>
              </div>
            </div>
            <p className="text-xl bg-gradient-to-br from-white via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent font-medium tracking-wide">
              L'AGENCE PHOCÉENNE
            </p>
          </div>
        </div>

        <div 
          className={`bg-slate-800/40 backdrop-blur-xl rounded-xl p-8 space-y-6 shadow-2xl border border-slate-700/50 relative overflow-hidden transition-all duration-700 
          ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.3s' }}
        >
          {/* Background graphic elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white/90">
                Espace de travail
              </h2>
              <p className="text-sm text-white/60 mt-1">
                Connectez-vous pour accéder à votre tableau de bord
              </p>
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  {error}
                  {lockoutEndTime > Date.now() && countdownTimer && (
                    <p className="mt-1 text-red-300">Temps restant: {countdownTimer}</p>
                  )}
                </div>
              </div>
            )}
            
            {remainingAttempts <= 2 && remainingAttempts > 0 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  Attention: il vous reste {remainingAttempts} tentative{remainingAttempts > 1 ? 's' : ''} avant blocage temporaire
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                Identifiant
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Rocket className="h-5 w-5 text-white/40" />
                </div>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Votre identifiant" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-white/40 h-12 pl-10" 
                  autoComplete="username" 
                  disabled={isLoading || lockoutEndTime > Date.now()}
                />
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
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Votre mot de passe" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-white/40 h-12 pl-10 pr-10" 
                  autoComplete="current-password" 
                  disabled={isLoading || lockoutEndTime > Date.now()}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-white/40 hover:text-white/60" 
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || lockoutEndTime > Date.now()}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <Button 
                variant="link" 
                className="text-sm text-white/60 hover:text-purple-400 p-0" 
                onClick={onForgotPassword} 
                type="button" 
                disabled={isLoading || lockoutEndTime > Date.now()}
              >
                Mot de passe oublié ?
              </Button>
              <Button 
                variant="link" 
                className="text-sm text-white/60 hover:text-purple-400 p-0" 
                onClick={() => window.location.href = 'mailto:Contact@Phoceenagency.fr'} 
                type="button" 
                disabled={isLoading}
              >
                Contacter le support
              </Button>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 flex items-center justify-center group transition-all shadow-lg shadow-purple-900/20" 
              disabled={isLoading || lockoutEndTime > Date.now()} 
              type="submit"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ChevronRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
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

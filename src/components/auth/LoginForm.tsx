
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
  AlertTriangle,
  User
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

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-900 via-gray-900 to-slate-900 p-4 overflow-hidden relative">
      {/* Overlay avec motif subtil */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNmMtMy4zMTQgMC02IDIuNjg2LTYgNnMyLjY4NiA2IDYgNnptMC04Yy0xLjEwNSAwLTIgLjg5NS0yIDJzLjg5NSAyIDIgMiAyLS44OTUgMi0yLS44OTUtMi0yLTJ6Ii8+PC9nPjwvc3ZnPg==')] opacity-5"></div>

      {/* Effets de lumière */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-[80px] -mt-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-[80px] -mb-20"></div>

      {/* Carte de connexion */}
      <div className="w-full max-w-md relative z-10">
        <div 
          className={`bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden transition-all duration-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* En-tête avec logo */}
          <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-center border-b border-gray-200 dark:border-slate-700">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                ULTRA
              </h1>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                L'AGENCE PHOCÉENNE
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="p-6">
            {/* Titre */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Espace de travail
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Connectez-vous pour accéder à votre tableau de bord
              </p>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-start gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  {error}
                  {lockoutEndTime > Date.now() && countdownTimer && (
                    <p className="mt-1 font-semibold">Temps restant: {countdownTimer}</p>
                  )}
                </div>
              </div>
            )}

            {/* Avertissement tentatives restantes */}
            {remainingAttempts <= 2 && remainingAttempts > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-600 dark:text-amber-400 text-sm flex items-start gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  Attention: il vous reste {remainingAttempts} tentative{remainingAttempts > 1 ? 's' : ''} avant blocage temporaire
                </div>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                  Identifiant
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Votre identifiant" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    className="pl-10 bg-white dark:bg-slate-900" 
                    autoComplete="username" 
                    disabled={isLoading || lockoutEndTime > Date.now()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Mot de passe
                  </Label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Votre mot de passe" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    className="pl-10 pr-10 bg-white dark:bg-slate-900" 
                    autoComplete="current-password" 
                    disabled={isLoading || lockoutEndTime > Date.now()}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading || lockoutEndTime > Date.now()}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 rounded-md flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30" 
                disabled={isLoading || lockoutEndTime > Date.now()} 
                type="submit"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <>
                    <span className="font-medium">Se connecter</span>
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Liens d'aide */}
            <div className="mt-6 flex flex-col gap-3 text-center">
              <Button 
                variant="link" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" 
                onClick={onForgotPassword} 
                type="button" 
                disabled={isLoading || lockoutEndTime > Date.now()}
              >
                Mot de passe oublié ?
              </Button>
              
              <Button 
                variant="link" 
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" 
                onClick={() => window.location.href = 'mailto:Contact@Phoceenagency.fr'} 
                type="button" 
                disabled={isLoading}
              >
                Contacter le support
              </Button>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                <Link to="/external-matches" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center">
                  <span>Accéder aux matchs externes</span>
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginBackground } from "@/components/auth/LoginBackground";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginFooter } from "@/components/auth/LoginFooter";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  onLogin,
  onForgotPassword
}: LoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;

    if (isLocked && lockTimer > 0) {
      intervalId = window.setInterval(() => {
        setLockTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            setIsLocked(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLocked, lockTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }
    
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      await onLogin(username, password);
      // Reset attempts on successful login
      setLoginAttempts(0);
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(120); // 2 minutes lock
        setErrorMessage(`Trop de tentatives, compte verrouillé pour ${lockTimer} secondes`);
      } else {
        setErrorMessage(`Identifiants incorrects (${newAttempts}/5 tentatives)`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full min-h-screen flex bg-[#111827]">
      <LoginBackground />
      
      <div className={`w-full max-w-md mx-auto z-10 self-center px-4 transition-all duration-500 transform ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="bg-slate-900/90 border border-slate-800/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
          <LoginHeader />
          
          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-white">
                  Identifiant
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading || isLocked}
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading || isLocked}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                    disabled={isLoading || isLocked}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              {errorMessage && (
                <div className="bg-red-900/30 border border-red-800/50 text-red-200 px-3 py-2 rounded-md text-sm">
                  {errorMessage}
                </div>
              )}
              
              <div className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={isLoading || isLocked}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  ) : isLocked ? (
                    `Verrouillé (${lockTimer}s)`
                  ) : (
                    "Connexion"
                  )}
                </Button>
                
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300 text-center focus:outline-none"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            </form>
          </div>
          
          <LoginFooter />
        </div>
      </div>
    </div>
  );
};

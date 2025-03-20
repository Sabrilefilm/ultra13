
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Rocket, Mail, Shield, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useState, FormEvent } from "react";
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4">
      <div className="w-full max-w-[450px] mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Rocket className="w-14 h-14 text-purple-500 animate-pulse" />
                <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-xl opacity-30 animate-ping"></div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-400 bg-clip-text text-transparent neon-text">ULTRA</h1>
            </div>
            <p className="agency-text text-2xl bg-gradient-to-br from-white via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">BY AGENCE PHOCÉEN</p>
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

        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 space-y-6 shadow-xl border border-slate-700/50 relative overflow-hidden">
          {/* Background graphic elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <div className="space-y-4 relative">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                Identifiant
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-white/40" />
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-white/40 hover:text-white/60"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Button variant="link" className="text-sm text-white/60 hover:text-purple-400 p-0" onClick={onForgotPassword} type="button" disabled={isLoading}>
                Mot de passe oublié ?
              </Button>
              <Button variant="link" className="text-sm text-white/60 hover:text-purple-400 p-0" onClick={() => window.location.href = 'mailto:Contact@Phoceenagency.fr'} type="button" disabled={isLoading}>
                Contacter le support
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 flex items-center justify-center group transition-all" 
              onClick={() => handleSubmit()}
              disabled={isLoading}
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
            <div className="flex items-center justify-center">
              <Link to="/external-matches" className="text-sm text-center text-white/60 hover:text-purple-400 flex items-center gap-1">
                <span>Accéder aux matchs externes</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <Link to="/contact" className="text-sm text-center text-white/60 hover:text-purple-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>Contacter l'agence</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

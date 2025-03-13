
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Rocket, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onLogin, onForgotPassword }: LoginFormProps) => {
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-[450px] mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2">
              <Rocket className="w-14 h-14 text-purple-500 animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                AGENCY
              </h1>
            </div>
            <p className="agency-text text-2xl bg-gradient-to-br from-white via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
              PHOCÉEN
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

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 space-y-6 shadow-xl border border-white/10 relative overflow-hidden">
          {/* Background graphic elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <div className="space-y-4 relative">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                Identifiant
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Votre identifiant"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12"
              />
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="link"
                className="text-sm text-white/60 hover:text-purple-400 p-0"
                onClick={onForgotPassword}
              >
                Mot de passe oublié ?
              </Button>
              <Button
                variant="link"
                className="text-sm text-white/60 hover:text-purple-400 p-0"
                onClick={() => window.location.href = 'mailto:Contact@Phoceenagency.fr'}
              >
                Contacter le support
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-6 flex items-center justify-center group transition-all"
              onClick={handleSubmit}
            >
              <span>Se connecter</span>
              <ChevronRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
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

      <div className="fixed bottom-8 flex gap-6 text-sm text-white/40">
        <button className="hover:text-white/60 transition-colors">Aide</button>
        <button className="hover:text-white/60 transition-colors">Confidentialité</button>
        <button className="hover:text-white/60 transition-colors">Conditions</button>
      </div>
    </div>
  );
};

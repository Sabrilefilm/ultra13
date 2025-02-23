import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket } from "lucide-react";
import { useState } from "react";
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
  const handleSubmit = () => {
    onLogin(username, password);
  };
  return <div className="min-h-screen text-white p-4 flex flex-col items-center justify-center px-0 mx-0 my-[28px] py-[22px] bg-slate-950">
      <div className="w-full max-w-[450px] mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2">
              <Rocket className="w-14 h-14 text-primary animate-pulse" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-red-500 bg-clip-text text-transparent">
                ULTRA
              </h1>
            </div>
            <p className="agency-text bg-gradient-to-br from-white via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent text-center font-thin text-base px-px mx-0">By Agency Phocéen</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white/90">
              Votre Espace de Connexion
            </h2>
            <p className="text-sm text-white/60">
              Connectez-vous pour accéder à vos données statistiques
            </p>
          </div>
        </div>

        <div className="backdrop-blur-sm rounded-2xl p-8 space-y-6 shadow-xl border border-white/10 bg-sky-950">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">
                Identifiant
              </Label>
              <Input id="username" type="text" placeholder="Votre identifiant" value={username} onChange={e => setUsername(e.target.value)} onKeyPress={e => e.key === "Enter" && handleSubmit()} className="bg-black border-white/10 text-white placeholder:text-white/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">
                Mot de passe
              </Label>
              <Input id="password" type="password" placeholder="Votre mot de passe" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === "Enter" && handleSubmit()} className="bg-black border-white/10 text-white placeholder:text-white/40" />
            </div>
            <Button variant="link" onClick={onForgotPassword} className="text-white/60 hover:text-primary p-0 px-[8px] text-sm font-bold rounded-sm">
              Mot de passe oublié ?
            </Button>
          </div>

          <div className="space-y-4">
            <Button onClick={handleSubmit} className="w-full text-white font-medium py-6 bg-[#954d00]">
              Se connecter
            </Button>
            <p className="text-sm text-center text-white/40">Une plateforme sécurisée </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 flex gap-6 text-sm text-white/40">
        <button className="hover:text-white/60 transition-colors">Aide</button>
        <button className="hover:text-white/60 transition-colors">Confidentialité</button>
        <button className="hover:text-white/60 transition-colors">Conditions</button>
      </div>
    </div>;
};
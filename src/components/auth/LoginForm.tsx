
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-white/90">
          Identifiant
        </Label>
        <Input 
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="bg-transparent border-white/20 text-white placeholder:text-white/40"
          placeholder="Votre identifiant"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/90">
          Mot de passe
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-transparent border-white/20 text-white placeholder:text-white/40"
          placeholder="Votre mot de passe"
        />
      </div>
      <Button 
        type="submit"
        className="w-full text-white font-medium py-6 bg-[#954d00]"
      >
        Se connecter
      </Button>
    </form>
  );
};

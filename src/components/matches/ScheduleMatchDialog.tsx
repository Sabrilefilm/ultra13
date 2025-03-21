
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { CreatorSelect } from "../live-schedule/creator-select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useScheduleManagement } from "@/hooks/user-management/use-schedule-management";
import { format } from "date-fns";

interface ScheduleMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate?: Date;
}

export const ScheduleMatchDialog = ({
  isOpen,
  onClose,
  preselectedDate
}: ScheduleMatchDialogProps) => {
  const [creator1, setCreator1] = useState("");
  const [creator2, setCreator2] = useState("");
  const [isBoost, setIsBoost] = useState(true);
  const [agentName, setAgentName] = useState("");
  
  const { addMatch } = useScheduleManagement(() => {
    onClose();
  });
  
  const defaultDate = preselectedDate || new Date();
  const [matchDate, setMatchDate] = useState(format(defaultDate, "yyyy-MM-dd"));
  const [matchTime, setMatchTime] = useState("12:00");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
    console.log("Scheduling match with:", { creator1, creator2, matchDateTime, isBoost, agentName });
    
    const success = await addMatch(creator1, creator2, matchDateTime, isBoost, agentName);
    
    if (success) {
      onClose();
      setCreator1("");
      setCreator2("");
      setAgentName("");
      setMatchDate(format(new Date(), "yyyy-MM-dd"));
      setMatchTime("12:00");
      setIsBoost(true);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-purple-800/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Programmer un match TikTok
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Premier créateur</Label>
            <CreatorSelect value={creator1} onSelect={value => setCreator1(value)} />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Deuxième créateur</Label>
            <Input 
              placeholder="Nom du deuxième créateur" 
              value={creator2} 
              onChange={e => setCreator2(e.target.value)} 
              required 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" 
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Agent concerné</Label>
            <Input 
              placeholder="Nom de l'agent" 
              value={agentName} 
              onChange={e => setAgentName(e.target.value)} 
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Date du match</Label>
              <Input 
                type="date" 
                value={matchDate} 
                onChange={e => setMatchDate(e.target.value)} 
                required 
                className="bg-slate-800 border-slate-700 text-white" 
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Heure du match</Label>
              <Input 
                type="time" 
                value={matchTime} 
                onChange={e => setMatchTime(e.target.value)} 
                required 
                className="bg-slate-800 border-slate-700 text-white" 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              checked={isBoost} 
              onCheckedChange={setIsBoost} 
              className="data-[state=checked]:bg-purple-600" 
            />
            <Label className="cursor-pointer text-slate-300">
              {isBoost ? "Avec Boost" : "Sans Boost"}
            </Label>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Programmer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

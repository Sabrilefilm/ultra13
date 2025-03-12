
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
  const { addMatch } = useScheduleManagement(() => {
    onClose();
  });

  const defaultDate = preselectedDate || new Date();
  const [matchDate, setMatchDate] = useState(format(defaultDate, "yyyy-MM-dd"));
  const [matchTime, setMatchTime] = useState("12:00");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
    const success = await addMatch(creator1, creator2, matchDateTime, isBoost);
    if (success) {
      onClose();
      setCreator1("");
      setCreator2("");
      setMatchDate(format(new Date(), "yyyy-MM-dd"));
      setMatchTime("12:00");
      setIsBoost(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Programmer un match TikTok</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Premier créateur</Label>
            <CreatorSelect
              value={creator1}
              onSelect={(value) => setCreator1(value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Deuxième créateur</Label>
            <Input
              placeholder="Nom du deuxième créateur"
              value={creator2}
              onChange={(e) => setCreator2(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date du match</Label>
              <Input
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Heure du match</Label>
              <Input
                type="time"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isBoost}
              onCheckedChange={setIsBoost}
            />
            <Label className="cursor-pointer">
              {isBoost ? "Avec Boost" : "Sans Boost"}
            </Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Programmer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Account } from "@/types/accounts";

interface AccountCardProps {
  account: Account;
  showPassword: boolean;
  onTogglePassword: () => void;
  onDelete: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  showPassword,
  onTogglePassword,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-2">
              <div>
                <h3 className="text-lg font-semibold truncate">{account.username}</h3>
                <p className="text-sm text-muted-foreground capitalize">{account.role}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mot de passe:</span>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-accent/50 rounded text-sm">
                    {showPassword ? account.password : '••••••••'}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onTogglePassword}
                    className="h-8 w-8"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {account.profile && (
              <div className="flex gap-4 items-center text-sm">
                <div className="text-center">
                  <p className="font-semibold">{account.profile.total_diamonds || 0}</p>
                  <p className="text-xs text-muted-foreground">Diamants</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{account.profile.days_streamed || 0}</p>
                  <p className="text-xs text-muted-foreground">Jours</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{account.profile.total_live_hours || 0}</p>
                  <p className="text-xs text-muted-foreground">Heures</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

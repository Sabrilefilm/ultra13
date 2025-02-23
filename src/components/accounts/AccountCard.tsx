
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, EyeOff, Diamond, Calendar, Clock } from "lucide-react";
import { Account } from "@/types/accounts";

interface AccountCardProps {
  account: Account;
  showPassword: boolean;
  onTogglePassword: () => void;
  onDelete: () => void;
}

export const AccountCard = ({ 
  account, 
  showPassword, 
  onTogglePassword, 
  onDelete 
}: AccountCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{account.username}</h3>
            <p className="text-sm text-muted-foreground">
              {account.role === 'creator' ? 'Créateur' : account.role}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {account.role === 'creator' && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Diamond className="h-4 w-4" />
                  <span>{account.profile?.total_diamonds || 0} diamants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{account.profile?.days_streamed || 0} Jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{account.profile?.total_live_hours || 0}h de live</span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-sm"
              onClick={onTogglePassword}
            >
              <span className="mr-2">
                {showPassword ? account.password : '••••••'}
              </span>
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

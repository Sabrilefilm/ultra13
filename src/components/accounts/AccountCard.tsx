
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
  const isInactive = account.role === 'creator' && 
    (account.profile?.days_streamed || 0) < 3 && 
    (account.profile?.total_live_hours || 0) === 0;

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow ${isInactive ? 'border-[#ea384c] bg-[#ea384c]/5' : ''}`}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium ${isInactive ? 'text-[#ea384c]' : ''}`}>
              {account.username}
            </h3>
            <p className={`text-sm ${isInactive ? 'text-white' : 'text-muted-foreground'}`}>
              {account.role === 'creator' ? 'Créateur' : account.role}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {account.role === 'creator' && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Diamond className={`h-4 w-4 ${isInactive ? 'text-[#ea384c]' : ''}`} />
                  <span className={isInactive ? 'text-[#ea384c]' : ''}>
                    {account.profile?.total_diamonds || 0} diamants
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className={`h-4 w-4 ${isInactive ? 'text-[#ea384c]' : ''}`} />
                  <span className={isInactive ? 'text-[#ea384c]' : ''}>
                    {account.profile?.days_streamed || 0} Jours
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className={`h-4 w-4 ${isInactive ? 'text-[#ea384c]' : ''}`} />
                  <span className={isInactive ? 'text-[#ea384c]' : ''}>
                    {account.profile?.total_live_hours || 0}h de live
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm bg-black text-white hover:bg-black hover:text-white`}
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
              className={`h-8 w-8 text-white bg-black hover:bg-black hover:text-white`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Settings } from "lucide-react";

interface AgentStatusCardProps {
  name: string;
  status: "active" | "inactive" | "warning";
  performance: number;
  liveHours: number;
  targetHours: number;
  onContact: () => void;
  onManage: () => void;
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  name,
  status,
  performance,
  liveHours,
  targetHours,
  onContact,
  onManage
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return {
          badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
          text: "Actif",
          progressColor: "bg-green-500"
        };
      case "inactive":
        return {
          badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
          text: "Inactif",
          progressColor: "bg-red-500"
        };
      case "warning":
        return {
          badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
          text: "Attention",
          progressColor: "bg-amber-500"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
          text: "Inconnu",
          progressColor: "bg-gray-500"
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <Badge className={statusStyles.badge}>
                {statusStyles.text}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Performance</span>
              <span className="font-medium">{performance}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${statusStyles.progressColor}`} 
                style={{ width: `${performance}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Heures de live</span>
              <span className="font-medium">{liveHours}h / {targetHours}h</span>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full ${statusStyles.progressColor}`} 
                style={{ width: `${(liveHours / targetHours) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
              onClick={onContact}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Contacter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900/20"
              onClick={onManage}
            >
              <Settings className="h-4 w-4 mr-1" />
              Gérer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ComingSoonPage } from "@/components/coming-soon/ComingSoonPage";
import { MessageSquare } from "lucide-react";

const Messages = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <ComingSoonPage 
        title="Messagerie Ultra Agency" 
        icon={<MessageSquare className="h-16 w-16 text-purple-400" />}
        description="Notre système de messagerie interne sera bientôt disponible. Vous pourrez communiquer avec les créateurs, agents et managers directement depuis la plateforme."
      />
    </SidebarProvider>
  );
};

export default Messages;

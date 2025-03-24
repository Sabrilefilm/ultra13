
import React from "react";
import { Footer } from "@/components/layout/Footer";
import { RedesignedDashContent } from "@/components/dashboard/RedesignedDashContent";

interface DashboardContentProps {
  username: string;
  role: string;
  currentPage: string;
  onAction: (action: string, data?: any) => void;
  onLogout: () => void;
  children?: React.ReactNode;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  username,
  role,
  currentPage,
  onAction,
  onLogout,
  children
}) => {
  return (
    <div className="flex-1 overflow-auto pb-20 transition-all duration-300 flex flex-col">
      <div className="flex-1 overflow-auto">
        {children ? (
          children
        ) : (
          <RedesignedDashContent
            username={username}
            role={role}
            currentPage={currentPage}
            onAction={onAction}
          />
        )}
      </div>
      
      <Footer role={role} className="mt-auto" />
    </div>
  );
};

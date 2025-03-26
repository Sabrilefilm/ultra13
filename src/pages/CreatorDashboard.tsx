
import React from "react";
import { UltraSidebar } from "@/components/layout/UltraSidebar";
import { Dashboard } from "@/components/creator/dashboard/Dashboard";

const CreatorDashboard = () => {
  const role = localStorage.getItem("userRole");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 flex">
      <UltraSidebar
        username={localStorage.getItem("username") || ""}
        role={role || ""}
        userId={localStorage.getItem("userId") || ""}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        currentPage="dashboard"
      />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Dashboard role={role} />
      </div>
    </div>
  );
};

export default CreatorDashboard;

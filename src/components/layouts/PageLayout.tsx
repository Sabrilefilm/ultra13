
import React from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">{title}</h1>
        <div className="w-full">
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
};

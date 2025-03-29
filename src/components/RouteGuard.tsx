
import React from "react";
import { Navigate } from "react-router-dom";
import { useIndexAuth } from "@/hooks/use-index-auth";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useIndexAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

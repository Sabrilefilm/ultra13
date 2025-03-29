
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Penalties from "./pages/Penalties";
import Team from "./pages/Team";
import Schedule from "./pages/Schedule";
import UserManagement from "./pages/UserManagement";
import InternalRules from "./pages/InternalRules";
import CreatorRules from "./pages/CreatorRules";
import Messages from "./pages/Messages";
import Documents from "./pages/Documents";
import Transfers from "./pages/Transfers";
import CreatorStats from "./pages/CreatorStats";
import CreatorImport from "./pages/CreatorImport";
import Training from "./pages/Training";
import Matches from "./pages/Matches";
import CreatorDiamonds from "./pages/CreatorDiamonds";
import CreatorRewards from "./pages/CreatorRewards";
import Ambassador from "./pages/Ambassador";
import ManagerDashboard from "./pages/ManagerDashboard";
import { RouteGuard } from "@/components/RouteGuard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          }
        />
        <Route
          path="/penalties"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "ambassadeur"]}>
              <Penalties />
            </RouteGuard>
          }
        />
        <Route
          path="/team"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "agent"]}>
              <Team />
            </RouteGuard>
          }
        />
        <Route
          path="/schedule"
          element={
            <RouteGuard>
              <Schedule />
            </RouteGuard>
          }
        />
        <Route
          path="/user-management"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "agent"]}>
              <UserManagement />
            </RouteGuard>
          }
        />
        <Route
          path="/internal-rules"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "agent", "ambassadeur"]}>
              <InternalRules />
            </RouteGuard>
          }
        />
        <Route
          path="/creator-rules"
          element={
            <RouteGuard>
              <CreatorRules />
            </RouteGuard>
          }
        />
        <Route
          path="/messages"
          element={
            <RouteGuard>
              <Messages />
            </RouteGuard>
          }
        />
        <Route
          path="/documents"
          element={
            <RouteGuard>
              <Documents />
            </RouteGuard>
          }
        />
        <Route
          path="/transfers"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "creator"]}>
              <Transfers />
            </RouteGuard>
          }
        />
        <Route
          path="/creator-stats"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "agent", "ambassadeur"]}>
              <CreatorStats />
            </RouteGuard>
          }
        />
        <Route
          path="/creator-import"
          element={
            <RouteGuard allowedRoles={["founder"]}>
              <CreatorImport />
            </RouteGuard>
          }
        />
        <Route
          path="/training"
          element={
            <RouteGuard>
              <Training />
            </RouteGuard>
          }
        />
        <Route
          path="/matches"
          element={
            <RouteGuard>
              <Matches />
            </RouteGuard>
          }
        />
        <Route
          path="/creator-diamonds"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "agent"]}>
              <CreatorDiamonds />
            </RouteGuard>
          }
        />
        <Route
          path="/creator-rewards"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "creator"]}>
              <CreatorRewards />
            </RouteGuard>
          }
        />
        <Route
          path="/ambassador"
          element={
            <RouteGuard allowedRoles={["founder", "ambassadeur"]}>
              <Ambassador />
            </RouteGuard>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <RouteGuard allowedRoles={["founder", "manager"]}>
              <ManagerDashboard />
            </RouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;


import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Penalties from "./pages/Penalties";
import Schedule from "./pages/Schedule";
import UserManagement from "./pages/UserManagement";
import InternalRules from "./pages/InternalRules";
import CreatorRules from "./pages/CreatorRules";
import Messages from "./pages/Messages";
import Transfers from "./pages/Transfers";
import CreatorStats from "./pages/CreatorStats";
import CreatorImport from "./pages/CreatorImport";
import Training from "./pages/Training";
import CreatorDiamonds from "./pages/CreatorDiamonds";
import CreatorRewards from "./pages/CreatorRewards";
import Ambassador from "./pages/Ambassador";
import ManagerDashboard from "./pages/ManagerDashboard";
import AgentCreators from "./pages/AgentCreators";
import TeamManagement from "./pages/TeamManagement";
import RewardsManagement from "./pages/RewardsManagement";
import AgencyAssignment from "./pages/AgencyAssignment";
import { RouteGuard } from "@/components/RouteGuard";
import { DashboardView } from "@/components/dashboard/DashboardView";
import Matches from "./pages/Matches";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/dashboard"
          element={
            <RouteGuard>
              <DashboardView 
                username=""
                role=""
                onLogout={() => {}}
                platformSettings={null}
                handleCreateAccount={async () => {}}
                handleUpdateSettings={async () => {}}
                showWarning={false}
                dismissWarning={() => {}}
                formattedTime=""
              />
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
          path="/schedule"
          element={
            <RouteGuard allowedRoles={["founder", "manager"]}>
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
            <RouteGuard allowedRoles={["founder", "manager", "agent"]}>
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
          path="/rewards-management"
          element={
            <RouteGuard allowedRoles={["founder", "manager", "agent", "creator", "ambassadeur"]}>
              <RewardsManagement />
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
        <Route
          path="/matches"
          element={
            <RouteGuard allowedRoles={["founder", "manager"]}>
              <Matches />
            </RouteGuard>
          }
        />
        <Route
          path="/agency-assignment"
          element={
            <RouteGuard allowedRoles={["founder", "manager"]}>
              <AgencyAssignment />
            </RouteGuard>
          }
        />
        <Route
          path="/agency-assignment/:agentId"
          element={
            <RouteGuard allowedRoles={["founder", "manager"]}>
              <AgencyAssignment />
            </RouteGuard>
          }
        />
        <Route
          path="/agent-creators/:agentId"
          element={
            <RouteGuard allowedRoles={["founder", "manager"]}>
              <AgentCreators />
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

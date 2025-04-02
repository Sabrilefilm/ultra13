
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import CreatorRulesPage from './pages/CreatorRulesPage.tsx';
import UserManagement from './pages/UserManagement.tsx';
import Login from './pages/Login.tsx';
import CreatorStats from './pages/CreatorStatsPage.tsx';
import CreatorPerformance from './pages/CreatorPerformancePage.tsx';
import InternalRules from './pages/InternalRules.tsx';
import TransfersPage from './pages/TransfersPage.tsx';
import Transfers from './pages/Transfers.tsx';
import Training from './pages/Training.tsx';
import Messages from './pages/Messages.tsx';
import Penalties from './pages/Penalties.tsx';
import TeamManagement from './pages/TeamManagement.tsx';
import NotificationManagement from './pages/NotificationManagement.tsx';
import NotFound from './pages/NotFound.tsx';
import Contract from './pages/Contract.tsx';
import PersonalInfoPage from './pages/PersonalInfoPage.tsx';
import AgencyAssignment from './pages/AgencyAssignment.tsx';
import AgencyMembers from './pages/AgencyMembers.tsx';
import CreatorAgencyManagement from './pages/CreatorAgencyManagement.tsx';
import CreatorDetails from './pages/CreatorDetails.tsx';

// Toasts
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './providers/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/creator-rules" element={<CreatorRulesPage />} />
          <Route path="/internal-rules" element={<InternalRules />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/creator-stats" element={<CreatorStats />} />
          <Route path="/creator-performance/:userId" element={<CreatorPerformance />} />
          <Route path="/transfers-dashboard" element={<TransfersPage />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/training" element={<Training />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/penalties" element={<Penalties />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/notifications" element={<NotificationManagement />} />
          <Route path="/contract" element={<Contract />} />
          <Route path="/personal-info" element={<PersonalInfoPage />} />
          <Route path="/agency-assignment" element={<CreatorAgencyManagement />} />
          <Route path="/agency-assignment/:agentId" element={<AgencyAssignment />} />
          <Route path="/agency-members/:agentId" element={<AgencyMembers />} />
          <Route path="/creator-details/:creatorId" element={<CreatorDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Matches';
import CreatorRulesPage from './pages/CreatorRules';
import UserManagement from './pages/UserManagement';
import Login from './pages/Index';
import CreatorStats from './pages/CreatorStats';
import CreatorPerformance from './pages/CreatorStats';
import InternalRules from './pages/InternalRules';
import TransfersPage from './pages/Transfers';
import Transfers from './pages/Transfers';
import Training from './pages/Training';
import Messages from './pages/Messages';
import Penalties from './pages/Penalties';
import TeamManagement from './pages/TeamManagement';
import NotificationManagement from './pages/NotificationManagement';
import NotFound from './pages/NotFound';
import Contract from './pages/Contract';
import PersonalInfoPage from './pages/PersonalInfo';
import AgencyAssignment from './pages/AgencyAssignment';
import AgencyMembers from './pages/AgentCreators';
import CreatorAgencyManagement from './pages/AgencyAssignment';
import CreatorDetails from './pages/CreatorDetails';

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


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Matches from './pages/Matches';
import RewardsManagement from './pages/RewardsManagement';
import Documents from './pages/Documents';
import UserManagement from './pages/UserManagement';
import AgencyMembers from './pages/AgencyMembers';
import AgencyAssignment from './pages/AgencyAssignment';
import Penalties from './pages/Penalties';
import NotificationManagement from './pages/NotificationManagement';
import Messages from './pages/Messages';
import InternalRules from './pages/InternalRules';
import CreatorRules from './pages/CreatorRules';
import TeamManagement from './pages/TeamManagement';
import PersonalInformation from './pages/PersonalInformation';
import Contact from './pages/Contact';
import Transfers from './pages/Transfers';
import ExternalMatches from './pages/ExternalMatches';
import Schedule from './pages/Schedule';
import NotFound from './pages/NotFound';
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreatorRewards from './pages/CreatorRewards';
import CreatorStats from './pages/CreatorStats';
import { useDarkMode } from './hooks/use-dark-mode';

function App() {
  const queryClient = new QueryClient();
  const { isDarkMode } = useDarkMode();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/rewards-management" element={<RewardsManagement />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/agency-members" element={<AgencyMembers />} />
              <Route path="/agency-assignment" element={<AgencyAssignment />} />
              <Route path="/penalties" element={<Penalties />} />
              <Route path="/notifications" element={<NotificationManagement />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/internal-rules" element={<InternalRules />} />
              <Route path="/creator-rules" element={<CreatorRules />} />
              <Route path="/team-management" element={<TeamManagement />} />
              <Route path="/personal-information" element={<PersonalInformation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/transfers" element={<Transfers />} />
              <Route path="/external-matches" element={<ExternalMatches />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/creator-rewards" element={<CreatorRewards />} />
              <Route path="/creator-stats" element={<CreatorStats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;

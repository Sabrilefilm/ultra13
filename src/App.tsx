
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/UserManagement";
import NotificationManagement from "./pages/NotificationManagement";
import PersonalInformation from "./pages/PersonalInformation";
import AgencyMembers from "./pages/AgencyMembers";
import CreatorStats from "./pages/CreatorStats";
import AgencyAssignment from "./pages/AgencyAssignment";
import ExternalMatches from "./pages/ExternalMatches";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/notifications" element={<NotificationManagement />} />
        <Route path="/personal-information" element={<PersonalInformation />} />
        <Route path="/agency-members/:agentId" element={<AgencyMembers />} />
        <Route path="/creator-stats" element={<CreatorStats />} />
        <Route path="/agency-assignment" element={<AgencyAssignment />} />
        <Route path="/external-matches" element={<ExternalMatches />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

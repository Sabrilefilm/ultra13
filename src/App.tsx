
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import RewardsManagement from "./pages/RewardsManagement";
import NotFound from "./pages/NotFound";
import PersonalInformation from "./pages/PersonalInformation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/rewards-management" element={<RewardsManagement />} />
        <Route path="/personal-information" element={<PersonalInformation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

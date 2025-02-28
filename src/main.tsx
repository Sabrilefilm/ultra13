
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import Index from './pages/Index.tsx';
import NotFound from './pages/NotFound.tsx';
import Accounts from './pages/Accounts.tsx';
import RewardsManagement from './pages/RewardsManagement.tsx';
import PersonalInformation from './pages/PersonalInformation.tsx';
import NotificationManagement from './pages/NotificationManagement.tsx';
import UserManagement from './pages/UserManagement.tsx';
import "./index.css";
import { Toaster } from './components/ui/toaster';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: '/accounts',
    element: <Accounts />
  },
  {
    path: '/rewards',
    element: <RewardsManagement />
  },
  {
    path: '/notifications',
    element: <NotificationManagement />
  },
  {
    path: '/personal-info',
    element: <PersonalInformation />
  },
  {
    path: '/user-management',
    element: <UserManagement />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>,
)

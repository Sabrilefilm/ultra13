
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './providers/AuthProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { scheduleService } from '@/services/schedule/schedule-service';
import { diamondsService } from '@/services/diamonds/diamonds-service';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Monthly reset check component
const MonthlyResetChecker = () => {
  useEffect(() => {
    const checkMonthlyResets = async () => {
      console.log("Checking for monthly resets...");
      try {
        // Check and potentially reset schedules
        await scheduleService.checkAndResetMonthlySchedules();
        
        // Check and potentially reset diamonds
        await diamondsService.checkAndResetMonthlyDiamonds();
      } catch (error) {
        console.error("Error in monthly reset checks:", error);
      }
    };
    
    // Run immediately on load
    checkMonthlyResets();
    
    // Set up a daily check
    const intervalId = setInterval(() => {
      checkMonthlyResets();
    }, 24 * 60 * 60 * 1000); // Check once per day
    
    return () => clearInterval(intervalId);
  }, []);
  
  return null; // This component doesn't render anything
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SidebarProvider defaultOpen={true}>
            <MonthlyResetChecker />
            <App />
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)


import { ReactNode } from 'react';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Footer } from '@/components/layout/Footer';
import { LogoutButton } from '@/components/layout/LogoutButton';

interface MessagesLayoutProps {
  children: ReactNode;
  username: string;
  role: string;
  userId: string;
  onLogout: () => void;
}

export function MessagesLayout({ 
  children, 
  username, 
  role, 
  userId, 
  onLogout 
}: MessagesLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row relative overflow-hidden">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={onLogout}
        currentPage="messages"
      />
      
      <div className="flex-1 flex flex-col relative">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-blue-300 dark:bg-blue-700 blur-3xl"></div>
          <div className="absolute right-10 top-1/4 w-72 h-72 rounded-full bg-indigo-300 dark:bg-indigo-700 blur-3xl"></div>
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full bg-blue-200 dark:bg-blue-800 blur-3xl"></div>
        </div>
        
        {/* Logout button dans le coin supérieur droit */}
        <div className="absolute top-4 right-4 z-10">
          <LogoutButton onLogout={onLogout} username={username} />
        </div>
        
        <div className="flex-1 p-4 z-10">
          {children}
        </div>
        
        <Footer className="mt-auto z-10" role={role} />
      </div>
    </div>
  );
}

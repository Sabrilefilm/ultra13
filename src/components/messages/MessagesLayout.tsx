
import { ReactNode } from 'react';
import { UltraSidebar } from '@/components/layout/UltraSidebar';
import { Footer } from '@/components/layout/Footer';

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col md:flex-row relative">
      <UltraSidebar 
        username={username}
        role={role}
        userId={userId}
        onLogout={onLogout}
        currentPage="messages"
      />
      
      <div className="flex-1 flex flex-col relative">
        {children}
        <Footer className="mt-auto" />
      </div>
    </div>
  );
}

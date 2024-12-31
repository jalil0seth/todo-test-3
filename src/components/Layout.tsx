import React from 'react';
import { ChatBot } from './ChatBot';
import { TaskStats } from './TaskStats';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#f6f6ef]">
      <header className="bg-gradient-to-r from-[#ff6600] to-[#ff8533] px-4 py-2 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-base font-bold text-white">Task Manager</h1>
            <nav className="flex gap-6">
              <a href="#" className="text-sm text-white/90 hover:text-white">Tasks</a>
              <a href="#" className="text-sm text-white/90 hover:text-white">Projects</a>
              <a href="#" className="text-sm text-white/90 hover:text-white">Analytics</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => signOut()} 
              className="px-3 py-1.5 text-sm bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>
      
      <div className="max-w-[1440px] mx-auto grid grid-cols-[350px_1fr_280px] gap-6 p-4">
        <aside className="sticky top-20 h-[calc(100vh-5rem)]">
          <div className="bg-white rounded-lg shadow-sm h-full overflow-hidden">
            <ChatBot />
          </div>
        </aside>
        
        <main className="min-w-0">
          {children}
        </main>
        
        <aside className="sticky top-20 h-[calc(100vh-5rem)]">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <TaskStats />
          </div>
        </aside>
      </div>
    </div>
  );
}
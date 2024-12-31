import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TaskProvider } from './context/TaskContext';
import { TaskList } from './components/TaskList';
import { AuthProvider } from './context/AuthContext';
import { AuthForm } from './components/auth/AuthForm';
import { useAuth } from './context/AuthContext';

function AuthenticatedApp() {
  return (
    <TaskProvider>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <TaskList />
        </div>
      </Layout>
    </TaskProvider>
  );
}

function UnauthenticatedApp() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-[#f6f6ef] flex flex-col items-center justify-center p-4">
      <AuthForm mode={mode} />
      <button
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        className="mt-4 text-sm text-gray-600 hover:text-gray-800"
      >
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Sign In'}
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f6ef] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6600]"></div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default App;
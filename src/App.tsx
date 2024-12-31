import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ConnectionStatus } from './components/ConnectionStatus';
import { AppContent } from './components/auth/AppContent';

export default function App() {
  return (
    <AuthProvider>
      <ConnectionStatus />
      <AppContent />
    </AuthProvider>
  );
}
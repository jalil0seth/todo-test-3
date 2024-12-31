import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthenticatedApp } from './AuthenticatedApp';
import { UnauthenticatedApp } from './UnauthenticatedApp';
import { LoadingSpinner } from './LoadingSpinner';

export function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}
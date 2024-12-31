import React, { useState } from 'react';
import { AuthForm } from './AuthForm';
import { AUTH_MODES, AuthMode } from '../../constants/auth';
import { COLORS } from '../../constants/theme';

export function UnauthenticatedApp() {
  const [mode, setMode] = useState<AuthMode>(AUTH_MODES.LOGIN);

  const toggleMode = () => setMode(mode === AUTH_MODES.LOGIN ? AUTH_MODES.REGISTER : AUTH_MODES.LOGIN);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: COLORS.background }}>
      <AuthForm mode={mode} />
      <button
        onClick={toggleMode}
        className="mt-4 text-sm text-gray-600 hover:text-gray-800"
      >
        {mode === AUTH_MODES.LOGIN ? 'Need an account? Register' : 'Have an account? Sign In'}
      </button>
    </div>
  );
}
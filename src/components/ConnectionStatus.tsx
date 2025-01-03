import React from 'react';
import { isSupabaseConnected } from '../lib/supabase';

export function ConnectionStatus() {
  if (isSupabaseConnected()) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 text-center">
      <p className="text-yellow-800">
        Supabase connection is not properly configured. Please check your environment variables.
      </p>
    </div>
  );
}
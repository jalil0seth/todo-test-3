import React from 'react';
import { Spinner } from '../ui/Spinner';
import { COLORS } from '../../constants/theme';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
      <Spinner size="large" />
    </div>
  );
}
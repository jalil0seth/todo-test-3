import React from 'react';
import { SPINNER_SIZES } from '../../constants/theme';

interface SpinnerProps {
  size?: keyof typeof SPINNER_SIZES;
}

export function Spinner({ size = 'medium' }: SpinnerProps) {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-[#ff6600] ${SPINNER_SIZES[size]}`} />
  );
}
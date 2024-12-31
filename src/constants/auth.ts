export const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register'
} as const;

export type AuthMode = typeof AUTH_MODES[keyof typeof AUTH_MODES];
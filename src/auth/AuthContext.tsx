import React, { createContext, useContext } from 'react';

export type AuthUser = {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
};

const AuthContext = createContext<AuthUser | null>(null);
export const AuthUserProvider = AuthContext.Provider;
export const useAuthUser = () => useContext(AuthContext);

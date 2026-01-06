'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getCurrentUser, createUser } from '../api/users/client';
import { User } from '../types/types';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrCreateUser = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError(null);
      
      // Try to get existing user
      let userData;
      try {
        userData = await getCurrentUser(session);
      } catch (err) {
        // If user doesn't exist, create one
        if ((err as Error).message.includes('not found') || (err as Error).message.includes('404')) {
          userData = await createUser(session, {
            email: session.user.email,
            name: session.user.name || undefined,
          });
        } else {
          throw err;
        }
      }
      
      setUser(userData);
    } catch (err) {
      console.error('Failed to load or create user:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!session?.user?.email) return;
    await loadOrCreateUser();
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session?.user?.email) {
      loadOrCreateUser();
    } else {
      setUser(null);
      setLoading(false);
      setError(null);
    }
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
'use client'

import {createContext, useCallback, useContext, useMemo, useState} from 'react';
import User from "@/types/User";
import getDateFormatByCountry from "@/lib/getDateFormatByCountry";
import apiFetch from "@/lib/apiFetch";
import {useRouter} from "next/navigation";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  defaultDateFormat: string;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = (
  {
    children,
    initialUser
  }: {
    children: React.ReactNode,
    initialUser: User
  }) => {
  const [user, setUserState] = useState<User>(initialUser);
  const router = useRouter();

  const defaultDateFormat = useMemo(() => {
    return getDateFormatByCountry(user?.address?.country)
  }, [user?.address?.country]);

  const setUser = useCallback((userToSet: User) => {
    setUserState(userToSet);
  }, [setUserState]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/logout', {
        method: 'POST',
      });
    } catch (e) {
    }

    router.refresh()
    router.replace('/signin')
  }, [router]);

  const value = useMemo(() => ({
    user,
    setUser,
    logout,
    defaultDateFormat
  }), [user, setUser, logout, defaultDateFormat]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext)

  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}

export const useSafeUser = () => {
  try {
    return useUser()
  } catch (err) {
    return null;
  }
}

'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import User from "@/types/User";
import getDateFormatByCountry from "@/lib/getDateFormatByCountry";

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  defaultDateFormat: string;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [defaultDateFormat, setDefaultDateFormat] = useState<string>('MM/DD/YYYY');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const userData = JSON.parse(storedUser) as User;
    setUser(userData)
    setDefaultDateFormat(getDateFormatByCountry(userData.address?.country ?? null));
  }, []);

  const setUser = useCallback((userToSet: User) => {
    localStorage.setItem("user", JSON.stringify(userToSet));
    setUserState(userToSet);
  }, [setUserState]);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    setUserState(null);
  }, [setUserState]);


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

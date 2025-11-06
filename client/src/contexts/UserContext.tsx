'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import User from "@/types/User";
import getDateFormatByCountry from "@/lib/getDateFormatByCountry";
import {fetchUser} from "@/lib/database/User";
import {ApiStatus} from "@/types/ApiResponse";
import apiFetch from "@/lib/apiFetch";
import {useRouter} from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function handleFetchUser() {
      const res = await fetchUser();

      if (cancelled) return;

      if (res.status === ApiStatus.SUCCESS) {
        setUserState(res.user);
        setDefaultDateFormat(
          getDateFormatByCountry(res.user.address?.country ?? null)
        );
      } else {
        setUserState(null);
      }
    }

    handleFetchUser()

    return () => {
      cancelled = true;
    }
  }, []);

  const setUser = useCallback((userToSet: User) => {
    setUserState(userToSet);
  }, [setUserState]);

  const logout = useCallback(async () => {
    console.log('logout')
    try {
      await apiFetch('/logout', {
        method: 'POST',
      });
    } catch (e) {
      console.log(e)
    }

    setUserState(null);

    if (typeof window !== 'undefined') {
      router.replace('/signin')
    }
  }, [setUserState, router]);


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

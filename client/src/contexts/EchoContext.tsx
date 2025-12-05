'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {createEcho} from '@/lib/echo';
import Echo from 'laravel-echo';

interface EchoContextType {
  echo: Echo<'reverb'> | null;
}

const EchoContext = createContext<EchoContextType>({echo: null});

export const EchoProvider = ({children}: { children: ReactNode }) => {
  const [echo, setEcho] = useState<Echo<'reverb'> | null>(null);

  useEffect(() => {
    const echoInstance = createEcho();
    setEcho(echoInstance);

    return () => {
      echoInstance.disconnect();
    };
  }, []);

  return (
    <EchoContext.Provider value={{echo}}>
      {children}
    </EchoContext.Provider>
  );
};

export const useEcho = () => {
  const context = useContext(EchoContext)

  if (context === null) {
    throw new Error('useEcho must be used within a EchoProvider');
  }

  return useContext(EchoContext)
};
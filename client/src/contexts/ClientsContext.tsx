"use client";

import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {
  createClient as createClientApi,
  CreateClientResponse,
  fetchClient as fetchClientApi,
  FetchClientResponse,
  fetchClients as fetchClientsApi,
  FetchClientsResponse,
  removeClient as removeClientApi,
  updateClient as updateClientApi,
  UpdateClientResponse,
} from "@/lib/database/Client";
import {ApiStatus} from "@/types/ApiResponse";
import Client from "@/types/Client";
import {ApiFetchResponse} from "@/lib/apiFetch";

interface UserDataContextType {
  clients: Client[];
  loadingClients: boolean;
  fetchClients: (...args: Parameters<typeof fetchClientsApi>) => Promise<ApiFetchResponse<FetchClientsResponse>>;
  fetchClient: (...args: Parameters<typeof fetchClientApi>) => Promise<ApiFetchResponse<FetchClientResponse>>;
  createClient: (...args: Parameters<typeof createClientApi>) => Promise<ApiFetchResponse<CreateClientResponse>>;
  updateClient: (...args: Parameters<typeof updateClientApi>) => Promise<ApiFetchResponse<UpdateClientResponse>>;
  removeClient: (...args: Parameters<typeof removeClientApi>) => Promise<ApiFetchResponse>;
}

const ClientsContext = createContext<UserDataContextType | undefined>(undefined);

export const ClientsProvider = ({children}: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const fetchClients = useCallback(async (...args: Parameters<typeof fetchClientsApi>) => {
    setLoadingClients(true);
    const res = await fetchClientsApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      setClients(res.clients);
    }
    setLoadingClients(false);
    return res;
  }, [])

  const fetchClient = useCallback(async (...args: Parameters<typeof fetchClientApi>) => {
    setLoadingClients(true);
    return await fetchClientApi(...args);
  }, [])

  const createClient = useCallback(async (...args: Parameters<typeof createClientApi>) => {
    const res = await createClientApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchClients();
    }
    return res;
  }, [fetchClients])

  const updateClient = useCallback(async (...args: Parameters<typeof updateClientApi>) => {
    const res = await updateClientApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchClients();
    }
    return res;
  }, [fetchClients])

  const removeClient = useCallback(async (...args: Parameters<typeof removeClientApi>) => {
    const res = await removeClientApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      setClients(prev => prev.filter(c => c.id !== args[0]));
    }
    return res;
  }, [])

  const value = useMemo(() => ({
    clients,
    loadingClients,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    removeClient,
  }), [clients, loadingClients, fetchClient, createClient, updateClient, removeClient])

  return (
    <ClientsContext.Provider
      value={value}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};

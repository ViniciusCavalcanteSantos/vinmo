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
import ClientType from "@/types/ClientType";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {UploadFile} from "antd";

interface UserDataContextType {
  clients: ClientType[];
  loadingClients: boolean;
  fetchClients: (page?: number, pageSize?: number, searchTerm?: string) => Promise<ApiFetchResponse<FetchClientsResponse>>;
  fetchClient: (id: number) => Promise<ApiFetchResponse<FetchClientResponse>>;
  createClient: (values: any, profile: UploadFile) => Promise<ApiFetchResponse<CreateClientResponse>>;
  updateClient: (id: number, values: any, profile: UploadFile) => Promise<ApiFetchResponse<UpdateClientResponse>>;
  removeClient: (id: number) => Promise<ApiFetchResponse>;
}

const ClientsContext = createContext<UserDataContextType | undefined>(undefined);

export const ClientsProvider = ({children}: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const fetchClients = useCallback(async (page: number = 1, pageSize: number = 15, searchTerm?: string) => {
    setLoadingClients(true);
    const res = await fetchClientsApi(page, pageSize, searchTerm || "");
    if (res.status === ApiStatus.SUCCESS) {
      setClients(res.clients);
    }
    setLoadingClients(false);
    return res;
  }, [])

  const fetchClient = useCallback(async (id: number) => {
    setLoadingClients(true);
    return await fetchClientApi(id);
  }, [])

  const createClient = useCallback(async (values: any, profile: UploadFile) => {
    const res = await createClientApi(values, profile);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchClients();
    }
    return res;
  }, [fetchClients])

  const updateClient = useCallback(async (id: number, values: any, profile: UploadFile) => {
    const res = await updateClientApi(id, values, profile);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchClients();
    }
    return res;
  }, [fetchClients])

  const removeClient = useCallback(async (id: number) => {
    const res = await removeClientApi(id);
    if (res.status === ApiStatus.SUCCESS) {
      setClients(prev => prev.filter(c => c.id !== id));
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

"use client";

import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {
  createContract as createContractApi,
  CreateContractResponse,
  fetchContracts as fetchContractsApi,
  FetchContractsResponse,
  removeContract as removeContractApi,
  updateContract as updateContractApi,
  UpdateContractResponse,
} from "@/lib/database/Contract";
import {ApiStatus} from "@/types/ApiResponse";
import ContractType from "@/types/ContractType";
import {ApiFetchResponse} from "@/lib/apiFetch";

interface UserDataContextType {
  contracts: ContractType[];
  loadingContracts: boolean;
  fetchContracts: (page?: number, pageSize?: number, searchTerm?: string) => Promise<ApiFetchResponse<FetchContractsResponse>>;
  createContract: (values: any) => Promise<ApiFetchResponse<CreateContractResponse>>;
  updateContract: (id: number, values: any) => Promise<ApiFetchResponse<UpdateContractResponse>>;
  removeContract: (id: number) => Promise<ApiFetchResponse>;
}

const ContractsContext = createContext<UserDataContextType | undefined>(undefined);

export const ContractsProvider = ({children}: { children: React.ReactNode }) => {
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);

  const fetchContracts = useCallback(async (page: number = 1, pageSize: number = 15, searchTerm?: string) => {
    setLoadingContracts(true);
    const res = await fetchContractsApi(page, pageSize, searchTerm || "");
    if (res.status === ApiStatus.SUCCESS) {
      setContracts(res.contracts);
    }
    setLoadingContracts(false);
    return res;
  }, [])

  const createContract = useCallback(async (values: any) => {
    const res = await createContractApi(values);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchContracts();
    }
    return res;
  }, [fetchContracts]);

  const updateContract = useCallback(async (id: number, values: any) => {
    const res = await updateContractApi(id, values);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchContracts();
    }
    return res;
  }, [fetchContracts]);

  const removeContract = useCallback(async (id: number) => {
    const res = await removeContractApi(id);
    if (res.status === ApiStatus.SUCCESS) {
      setContracts(prev => prev.filter(c => c.id !== id));
    }
    return res;
  }, []);

  const value = useMemo(() => ({
    contracts,
    loadingContracts,
    fetchContracts,
    createContract,
    updateContract,
    removeContract,
  }), [contracts, loadingContracts, fetchContracts, createContract, updateContract, removeContract])

  return (
    <ContractsContext.Provider
      value={value}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (!context) {
    throw new Error("useContracts must be used within a ContractsProvider");
  }
  return context;
};

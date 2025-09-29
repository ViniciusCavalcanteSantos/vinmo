"use client";

import {createContext, useContext, useState} from "react";
import {
  createContract as createContractApi,
  CreateContractResponse,
  fetchContracts as fetchContractsApi,
  FetchContractsResponse
} from "@/lib/database/Contract";
import {ApiStatus} from "@/types/ApiResponse";
import ContractType from "@/types/ContractType";
import {ApiFetchResponse} from "@/lib/apiFetch";

interface UserDataContextType {
  contracts: ContractType[];
  loadingContracts: boolean;
  fetchContracts: (page?: number, pageSize?: number, searchTerm?: string) => Promise<ApiFetchResponse<FetchContractsResponse>>;
  createContract: (values: any) => Promise<ApiFetchResponse<CreateContractResponse>>;
  updateContract: (id: number, values: any) => Promise<void>;
  removeContract: (id: number) => Promise<void>;
}

const ContractsContext = createContext<UserDataContextType | undefined>(undefined);

export const ContractsProvider = ({children}: { children: React.ReactNode }) => {
  const [contracts, setContracts] = useState<ContractType[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(false);

  const fetchContracts = async (page: number = 1, pageSize: number = 15, searchTerm?: string) => {
    setLoadingContracts(true);
    const res = await fetchContractsApi(page, pageSize, searchTerm || "");
    if (res.status === ApiStatus.SUCCESS) {
      setContracts(res.contracts);
    }
    setLoadingContracts(false);
    return res;
  }

  const createContract = async (values: any) => {
    const res = await createContractApi(values);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchContracts();
    }
    return res;
  };

  const updateContract = async (id: number, values: any) => {
    // const res = await updateContractApi(id, values);
    // if (res.status === ApiStatus.SUCCESS) {
    //   await fetchContracts();
    // }
    // return res;
  };

  const removeContract = async (id: number) => {
    // const res = await removeContractApi(id);
    // if (res.status === ApiStatus.SUCCESS) {
    //   setContracts(prev => prev.filter(c => c.id !== id));
    // }
    // return res;
  };

  return (
    <ContractsContext.Provider
      value={{
        contracts,
        loadingContracts,
        fetchContracts,
        createContract,
        updateContract,
        removeContract,
      }}
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

"use client";

import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {
  createContract as createContractApi,
  CreateContractResponse,
  fetchContracts as fetchContractsApi,
  FetchContractsResponse,
  removeContract,
  removeContract as removeContractApi,
  updateContract as updateContractApi,
  UpdateContractResponse,
} from "@/lib/database/Contract";
import {ApiStatus} from "@/types/ApiResponse";
import Contract from "@/types/Contract";
import {ApiFetchResponse} from "@/lib/apiFetch";

interface UserDataContextType {
  contracts: Contract[];
  loadingContracts: boolean;
  fetchContracts: (...args: Parameters<typeof fetchContractsApi>) => Promise<ApiFetchResponse<FetchContractsResponse>>;
  createContract: (...args: Parameters<typeof createContractApi>) => Promise<ApiFetchResponse<CreateContractResponse>>;
  updateContract: (...args: Parameters<typeof updateContractApi>) => Promise<ApiFetchResponse<UpdateContractResponse>>;
  removeContract: (...args: Parameters<typeof removeContract>) => Promise<ApiFetchResponse>;
}

const ContractsContext = createContext<UserDataContextType | undefined>(undefined);

export const ContractsProvider = ({children}: { children: React.ReactNode }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loadingContracts, setLoadingContracts] = useState(true);

  const fetchContracts = useCallback(async (...args: Parameters<typeof fetchContractsApi>) => {
    setLoadingContracts(true);
    const res = await fetchContractsApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      setContracts(res.contracts);
    }
    setLoadingContracts(false);
    return res;
  }, [])

  const createContract = useCallback(async (...args: Parameters<typeof createContractApi>) => {
    const res = await createContractApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchContracts();
    }
    return res;
  }, [fetchContracts]);

  const updateContract = useCallback(async (...args: Parameters<typeof updateContractApi>) => {
    const res = await updateContractApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchContracts();
    }
    return res;
  }, [fetchContracts]);

  const removeContract = useCallback(async (...args: Parameters<typeof removeContractApi>) => {
    const res = await removeContractApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      setContracts(prev => prev.filter(c => c.id !== args[0]));
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

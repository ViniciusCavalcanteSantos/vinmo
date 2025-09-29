import {ContractsProvider} from "@/contexts/ContractsContext";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <ContractsProvider>
      {children}
    </ContractsProvider>
  );
}

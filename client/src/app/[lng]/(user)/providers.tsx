import {ContractsProvider} from "@/contexts/ContractsContext";
import {EventsProvider} from "@/contexts/EventsContext";
import {ClientsProvider} from "@/contexts/ClientsContext";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <ContractsProvider>
      <EventsProvider>
        <ClientsProvider>
          {children}
        </ClientsProvider>
      </EventsProvider>
    </ContractsProvider>
  );
}

import {ContractsProvider} from "@/contexts/ContractsContext";
import {EventsProvider} from "@/contexts/EventsContext";
import {ClientsProvider} from "@/contexts/ClientsContext";
import {UserProvider} from "@/contexts/UserContext";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ContractsProvider>
        <EventsProvider>
          <ClientsProvider>
            {children}
          </ClientsProvider>
        </EventsProvider>
      </ContractsProvider>
    </UserProvider>
  );
}

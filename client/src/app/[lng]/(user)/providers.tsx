import {ContractsProvider} from "@/contexts/ContractsContext";
import {EventsProvider} from "@/contexts/EventsContext";
import {ClientsProvider} from "@/contexts/ClientsContext";
import {UserProvider} from "@/contexts/UserContext";
import User from "@/types/User";

export default function Providers({children, user}: { children: React.ReactNode, user: User }) {
  return (
    <UserProvider initialUser={user}>
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

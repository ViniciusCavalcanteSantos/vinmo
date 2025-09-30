import {ContractsProvider} from "@/contexts/ContractsContext";
import {EventsProvider} from "@/contexts/EventsContext";

export default function Providers({children}: { children: React.ReactNode }) {
  return (
    <ContractsProvider>
      <EventsProvider>
        {children}
      </EventsProvider>
    </ContractsProvider>
  );
}

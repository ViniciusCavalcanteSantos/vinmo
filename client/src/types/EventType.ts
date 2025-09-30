import {ContractCategory} from "@/types/ContractType";

type EventType = {
  id: number,
  contractId: number,
  eventDate: string,
  startTime?: string,
  endTime?: string,
  description?: string,
  createdAt: string,
  type: {
    id: number,
    name: string
    category: ContractCategory
  }
}

export default EventType
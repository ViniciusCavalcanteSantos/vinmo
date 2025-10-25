import ContractType, {ContractCategory} from "@/types/ContractType";

type EventType = {
  id: number,
  contractId: number,
  eventDate: string,
  startTime?: string,
  endTime?: string,
  description?: string,
  createdAt: string,
  contract?: ContractType
  type: {
    id: number,
    name: string
    category: ContractCategory
  }
}

export default EventType
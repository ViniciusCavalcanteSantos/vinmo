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
  totalImages: number,
  totalSize: number,
  type: {
    id: number,
    name: string
    category: ContractCategory
  }
}

export default EventType
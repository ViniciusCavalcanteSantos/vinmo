import {FullAddressType} from "@/types/AddressType";

export const guardianTypes = [
  'mother', 'father', 'grandmother', 'grandfather', 'uncle', 'aunt',
  'sister', 'brother', 'godmother', 'godfather', 'other'
] as const;

export type GuardianType = typeof guardianTypes[number];

type ClientType = {
  id: number,
  userId: number,
  name: string,
  profileUrl: string,
  code?: string,
  birthdate?: string,
  phone?: string,
  guardian?: {
    name: string,
    type: GuardianType,
    email?: string,
    phone?: string,
  },
  address?: FullAddressType
  createdAt: string
}

export default ClientType
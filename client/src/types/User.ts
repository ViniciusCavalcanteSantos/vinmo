import {FullAddressType} from "@/types/AddressType";

type User = {
  id: number,
  name: string,
  email: string,
  picture?: string,
  address: FullAddressType
}

export default User
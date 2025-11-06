import {components} from "@/types/api";

export type FullAddressType = components['schemas']['FullAddress']
export type CityAreaAddressType = components['schemas']['CityAreaAddress']

export type AddressType = components["schemas"]["Address"];

export function isFullAddress(
  address: AddressType | null | undefined
): address is FullAddressType {
  return !!address && address.granularity === "full_address";
}

export function isCityAreaAddress(
  address: AddressType | null | undefined
): address is CityAreaAddressType {
  return !!address && address.granularity === "city_area";
}

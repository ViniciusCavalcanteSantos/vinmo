import {components} from "@/types/api";

export type FullAddressType = components['schemas']['FullAddress']
export type CityAreaAddressType = components['schemas']['CityAreaAddress']

export type Address = components["schemas"]["Address"];

export function isFullAddress(
  address: Address | null | undefined
): address is FullAddressType {
  return !!address && address.granularity === "full_address";
}

export function isCityAreaAddress(
  address: Address | null | undefined
): address is CityAreaAddressType {
  return !!address && address.granularity === "city_area";
}

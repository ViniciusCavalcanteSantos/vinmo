export type FullAddressType = {
  granularity: string,
  street: string,
  number: string,
  neighborhood: string,
  complement?: string,
  city: string,
  state: string,
  country: string,
}

export type CityAreaAddressType = {
  granularity: string,
  city: string,
  state: string,
  country: string,
}
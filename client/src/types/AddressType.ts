export type FullAddressType = {
  granularity: string,
  postalCode: string,
  street: string,
  number: string,
  neighborhood: string,
  complement?: string,
  city: string,
  state: string,
  stateName?: string,
  country: string,
  countryName?: string,
}

export type CityAreaAddressType = {
  granularity: string,
  city: string,
  state: string,
  stateName?: string,
  country: string,
  countryName?: string,
}
import {components} from "@/types/api";

export type GuardianType = components["schemas"]["ClientGuardian"]["type"];

export const guardianTypes = [
  'mother', 'father', 'grandmother', 'grandfather', 'uncle', 'aunt',
  'sister', 'brother', 'godmother', 'godfather', 'other'
] as const satisfies readonly GuardianType[];

export type ClientType = components["schemas"]["Client"]

export default ClientType
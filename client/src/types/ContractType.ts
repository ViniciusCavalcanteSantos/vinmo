import {components} from "@/types/api";

type ContractType = components['schemas']['Contract'];
export type ContractCategory = components["schemas"]["ContractCategory"];
export type GraduationDetails = components["schemas"]["GraduationDetails"];

export type GraduationDetailsType =
  components["schemas"]["GraduationDetails"]["type"];

export type GraduationDetailsShift =
  components["schemas"]["GraduationDetails"]["shift"];

export type GraduationDetailsSchoolLevel =
  components["schemas"]["GraduationDetails"]["schoolGradeLevel"];

export default ContractType
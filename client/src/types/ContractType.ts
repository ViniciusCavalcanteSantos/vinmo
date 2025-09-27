enum graduationDetailsType {
  UNIVERSITY = 'university',
  SCHOOL = 'school',
}

enum graduationDetailsShift {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
  FULL_TIME = 'full_time',
}

enum graduationDetailsSchoolLevel {
  ELEMENTARY_SCHOOL = 'elementary_school',
  MIDDLE_SCHOOL = 'middle_school',
  HIGH_SCHOOL = 'high_school',
}

type ContractType = {
  id: number,
  code: string,
  title: string,
  address: {
    granularity: string,
    city: string,
    state: string,
    country: string,
  }
  graduationDetails?: {
    type: graduationDetailsType,
    institutionName: string,
    institutionAcronym?: string,
    className: string,
    shift: graduationDetailsShift
    conclusionYear: number,
    universityCourse?: string,
    schoolGradeLevel?: graduationDetailsSchoolLevel,
  }
}

export default ContractType
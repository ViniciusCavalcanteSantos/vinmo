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
  graduation_details?: {
    type: graduationDetailsType,
    institution_name: string,
    institution_acronym?: string,
    class: string,
    shift: graduationDetailsShift
    conclusion_year: number,

    university_course?: string,
    school_grade_level?: graduationDetailsSchoolLevel,
  },
}

export default ContractType
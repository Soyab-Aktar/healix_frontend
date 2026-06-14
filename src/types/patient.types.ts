import { UserStatus } from "./doctor.types"

export interface IPatientHealthData {
  id: string
  dateOfBirth?: string | Date | null
  gender?: "MALE" | "FEMALE" | "OTHER" | string | null
  bloodGroup?: string | null
  height?: string | null
  weight?: string | null
  smokingStatus?: boolean | null
  pregnancyStatus?: boolean | null
  hasAllergies?: boolean | null
  hasDiabetes?: boolean | null
  dietaryPreferences?: string | null
  mentalHealthHistory?: string | null
  immunizationStatus?: string | null
  hasPastSurgeries?: boolean | null
  recentAnxiety?: boolean | null
  recentDepression?: boolean | null
  maritalStatus?: string | null
  // Compatibility fields
  isSmoking?: boolean | null
  isAlcoholic?: boolean | null
  hasPregnancy?: boolean | null
  hasCardiovascularDisease?: boolean | null
  hasRenalDisease?: boolean | null
  hasCancer?: boolean | null
  hasHypertension?: boolean | null
  hasAsthma?: boolean | null
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface IMedicalReport {
  id: string
  reportName: string
  reportLink: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface IPatient {
  id: string
  name: string
  email: string
  profilePhoto?: string | null
  contactNumber?: string | null
  address?: string | null
  isDeleted: boolean
  createdAt: string | Date
  updatedAt: string | Date
  userId: string
  user: {
    status: UserStatus
  }
  patientHealthData?: IPatientHealthData | null
  medicalReports?: IMedicalReport[] | null
}

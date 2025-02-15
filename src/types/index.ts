export interface PatientInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
}

export interface TriageData {
  region: string;
  specialty: string;
  urgencyLevel: string;
  incidentType: string;
  painLevel: string;
  duration: string;
  durationUnit: string;
  criticalSigns: string[];
  consciousnessState: string;
  description: string;
}

export interface AppointmentType {
  type: 'in-person' | 'teleconsultation';
  preferredTime: string;
}

export interface FormState {
  step: number;
  patientInfo: PatientInfo;
  triage: TriageData;
  appointment: AppointmentType;
}

export interface WaitTimeData {
  typical: number;
  inPerson: {
    routine: number;
    urgent: number;
  };
  teleconsultation: number;
}
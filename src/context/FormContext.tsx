import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, PatientInfo, TriageData, AppointmentType } from '../types';

type FormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_PATIENT_INFO'; payload: PatientInfo }
  | { type: 'SET_TRIAGE'; payload: TriageData }
  | { type: 'SET_APPOINTMENT'; payload: AppointmentType }
  | { type: 'RESET_FORM' }
  | { type: 'SET_MAP_VISIBILITY'; payload: boolean };

export interface FormState {
  patientInfo: PatientInfo;
  triage: TriageData;
  appointment: AppointmentType;
  showMap: boolean;
  duration: string;
  durationUnit: string;
}

const initialState: FormState = {
  patientInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
  },
  triage: {
    region: 'Île-de-France',
    specialty: 'Cardiologist',
    urgencyLevel: '',
    incidentType: '',
    painLevel: '0',
    durationHours: '0',
    durationMinutes: '0',
    criticalSigns: [],
    consciousnessState: '',
    description: '',
    duration: '',
    durationUnit: 'minutes'
  },
  appointment: {
    type: 'in-person',
    preferredTime: '',
  },
  showMap: false,
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_PATIENT_INFO':
      return { ...state, patientInfo: action.payload };
    case 'SET_TRIAGE':
      return { ...state, triage: action.payload };
    case 'SET_APPOINTMENT':
      return { ...state, appointment: action.payload };
    case 'RESET_FORM':
      return initialState;
    case 'SET_MAP_VISIBILITY':
      return { ...state, showMap: action.payload };
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
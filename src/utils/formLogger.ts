import { TriageData } from '../types';

interface EmergencyFormData {
  urgencyLevel: string;
  incidentType: string;
  painLevel: string;
  duration: {
    value: string;
    unit: string;
  };
  criticalSigns: string[];
  consciousnessState: string;
  description: string;
}

export function logEmergencyData(data: TriageData): void {
  try {
    const formattedData: EmergencyFormData = {
      urgencyLevel: data.urgencyLevel,
      incidentType: data.incidentType,
      painLevel: data.painLevel,
      duration: {
        value: data.duration,
        unit: data.durationUnit
      },
      criticalSigns: data.criticalSigns,
      consciousnessState: data.consciousnessState,
      description: data.description
    };

    console.group('Emergency Patient Information');
    console.log('🚨 Urgency Level:', formattedData.urgencyLevel);
    console.log('🏥 Incident Type:', formattedData.incidentType);
    console.log('📊 Pain Level:', `${formattedData.painLevel}/10`);
    console.log('⏱️ Duration:', `${formattedData.duration.value} ${formattedData.duration.unit}`);
    console.log('⚠️ Critical Signs:', formattedData.criticalSigns.length ? formattedData.criticalSigns.join(', ') : 'None reported');
    console.log('🧠 Consciousness State:', formattedData.consciousnessState);
    console.log('📝 Description:', formattedData.description || 'No description provided');
    console.groupEnd();
  } catch (error) {
    console.error('Error logging emergency data:', error);
  }
}
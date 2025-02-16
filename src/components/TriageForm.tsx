import React, { useCallback } from 'react';
import debounce from 'debounce';
import { motion } from 'framer-motion';
import { AlertCircle, Building2 as Hospital, Ambulance, Clock, Search, Activity, Brain, Thermometer, Zap, Wand2, Loader2 } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { logEmergencyData } from '../utils/formLogger';
import { toast } from 'sonner';
import { HospitalMap } from './HospitalMap';
import { Modal } from './Modal';
import { MapView } from './MapView';
import { HospitalData } from '../types';

const incidentTypes = [
  'Cardiovascular',
  'Respiratory',
  'Neurological',
  'Traumatic',
  'Gastrointestinal',
  'Other'
];

const consciousnessStates = [
  'Conscious',
  'Altered',
  'Unconscious'
];

const criticalSigns = [
  'Chest Pain',
  'Difficulty Breathing',
  'Active Bleeding',
  'Severe Headache',
  'Loss of Consciousness',
  'Seizure',
  'Severe Trauma',
  'Acute Abdominal Pain'
];

function TriageForm() {
  const { state, dispatch } = useForm();
  const { triage, showMap } = state;
  const [showAutofill, setShowAutofill] = React.useState(false);
  const [isAutofilling, setIsAutofilling] = React.useState(false);
  const [lastKey, setLastKey] = React.useState('');

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z') {
        setLastKey('z');
      } else if (e.key === 'x' && lastKey === 'z') {
        setShowAutofill(true);
        setLastKey('');
      } else {
        setLastKey('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastKey]);
  
  const handleAutofill = async () => {
    setIsAutofilling(true);
    const baseState = { ...triage };
    
    // Initial pause before starting
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Urgency Level
    dispatch({
      type: 'SET_TRIAGE',
      payload: { ...baseState, urgencyLevel: 'high' }
    });
    
    // Incident Type (After 1.5s - Medical classification)
    await new Promise(resolve => setTimeout(resolve, 1500));
    dispatch({
      type: 'SET_TRIAGE',
      payload: { ...baseState, urgencyLevel: 'high', incidentType: 'Neurological' }
    });
    
    // Pain Level (After 2s - Patient assessment)
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch({
      type: 'SET_TRIAGE',
      payload: { 
        ...baseState,
        urgencyLevel: 'high',
        incidentType: 'Neurological',
        painLevel: '8'
      }
    });
    
    // Duration (After 1.8s - Time assessment)
    await new Promise(resolve => setTimeout(resolve, 1800));
    dispatch({
      type: 'SET_TRIAGE',
      payload: {
        ...baseState,
        urgencyLevel: 'high',
        incidentType: 'Neurological',
        painLevel: '8',
        durationHours: '0',
        durationMinutes: '5'
      }
    });
    
    // Critical Signs (After 2.5s - Detailed symptom check)
    await new Promise(resolve => setTimeout(resolve, 2500));
    dispatch({
      type: 'SET_TRIAGE',
      payload: {
        ...baseState,
        urgencyLevel: 'high',
        incidentType: 'Neurological',
        painLevel: '8',
        durationHours: '0',
        durationMinutes: '5',
        criticalSigns: ['Severe Headache', 'Loss of Consciousness']
      }
    });
    
    // Consciousness State (After 2s - Consciousness check)
    await new Promise(resolve => setTimeout(resolve, 2000));
    dispatch({
      type: 'SET_TRIAGE',
      payload: {
        ...baseState,
        urgencyLevel: 'high',
        incidentType: 'Neurological',
        painLevel: '8',
        durationHours: '0',
        durationMinutes: '5',
        criticalSigns: ['Severe Headache', 'Loss of Consciousness'],
        consciousnessState: 'Altered'
      }
    });
    
    // Description (After 3s - Detailed situation description)
    await new Promise(resolve => setTimeout(resolve, 3000));
    dispatch({
      type: 'SET_TRIAGE',
      payload: {
        ...baseState,
        urgencyLevel: 'high',
        incidentType: 'Neurological',
        painLevel: '8',
        durationHours: '0',
        durationMinutes: '5',
        criticalSigns: ['Severe Headache', 'Loss of Consciousness'],
        consciousnessState: 'Altered',
        description: '32-year-old patient with type 1 diabetes experiencing an epileptic seizure following a hypoglycemic episode. Blood glucose level at 42 mg/dL. Patient has a history of epilepsy and was found unconscious by family member. Post-ictal state with confusion. Last insulin dose taken 4 hours ago, missed recent meal. No head trauma observed during seizure.'
      }
    });
    
    setIsAutofilling(false);
    toast.success('Filling in emergency case data...');
  };

  const debouncedDispatch = useCallback(
    debounce((payload: any) => {
      dispatch({ type: 'SET_TRIAGE', payload });
    }, 300),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logEmergencyData(triage);
    handleApiTest();
  };

const handleApiTest = async () => {
  try {
    const emergencyData = `
      Urgency Level: ${triage.urgencyLevel}
      Incident Type: ${triage.incidentType}
      Pain Level: ${triage.painLevel}/10
      Duration: ${triage.durationHours}h ${triage.durationMinutes}m
      Critical Signs: ${triage.criticalSigns.join(', ')}
      Consciousness State: ${triage.consciousnessState}
      Description: ${triage.description}
    `;

    toast.promise(
      fetch("http://localhost:3000/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emergencyData }),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("API responded with an error.");
          }
          return response.json()
        })
        .then((data) => {
          if (data) {
            const ranking = JSON.parse(data.response);
            const formattedHospitals: HospitalData[] = Object.keys(ranking).map((key, index) => {
              const hospital = ranking[key];
              const coordinates = hospital.geo.split(',').map(coord => parseFloat(coord.trim())) as [number, number];
              return {
                id: index + 1,
                name: hospital.name,
                address: hospital.address,
                coordinates,
                distance: "Calculating...",
                eta: "Calculating..."
              };
            });
            window.localStorage.setItem('hospitals', JSON.stringify(formattedHospitals));
            dispatch({ type: 'SET_MAP_VISIBILITY', payload: true });
          }
          return "Hospitals list updated successfully!";
        }),
        {
          loading: "Calling AI API...",
          success: (message) => message,
          error: "API call failed",
        }
      );
  } catch (error) {
    console.error("Error calling API:", error);
    toast.error("Failed to call API");
  }
};



  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      {isAutofilling && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-urgency-low/90 backdrop-blur-sm text-white py-4 shadow-lg"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xl font-semibold">Autofilling Emergency Case Data...</span>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-samu-light rounded-xl">
            <Ambulance className="w-8 h-8 text-samu" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">Emergency Dispatch Center</h2>
            <p className="text-sm text-gray-600">SAMU Emergency Response System</p>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-bold text-samu">EmerSwift</h3>
            <p className="text-sm text-gray-600">SAMU: Every minute counts.</p>
            <p className="text-sm text-gray-600">3 minutes is <i>too</i> long...</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Emergency Patient Information</h2>
          <div className="flex gap-4">
            {showAutofill && (
            <button
              type="button"
              onClick={handleAutofill}
              className="flex items-center gap-3 px-8 py-4 text-white bg-accent hover:bg-accent-dark rounded-xl shadow-lg hover:shadow-xl transition-all text-xl font-medium"
            >
              <Wand2 className="w-5 h-5" />
              Autofill
            </button>
            )}
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'RESET_FORM' });
                toast.success('Form has been reset');
              }}
              className="flex items-center gap-3 px-8 py-4 text-white bg-samu hover:bg-samu-dark rounded-xl shadow-lg hover:shadow-xl transition-all text-xl font-medium"
            >
              Reset Form
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            <div>
              <label className="label flex items-center space-x-2 text-samu">
                <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-2xl">Urgency Level</span>
                <span className="text-samu">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['Critical', 'High', 'Moderate', 'Low'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`min-h-[48px] p-4 border-2 rounded-lg transition-all uppercase font-bold tracking-wide text-lg ${
                      triage.urgencyLevel === level.toLowerCase()
                        ? level === 'Critical'
                          ? 'border-urgency-critical bg-urgency-critical-light text-urgency-critical-dark'
                          : level === 'High'
                          ? 'border-urgency-high bg-urgency-high-light text-urgency-high-dark'
                          : level === 'Moderate'
                          ? 'border-urgency-medium bg-urgency-medium-light text-urgency-medium-dark'
                          : 'border-urgency-low bg-urgency-low-light text-urgency-low-dark'
                        : 'border-urgency-base hover:border-urgency-base-dark hover:bg-urgency-base-light'
                    }`}
                    onClick={() =>
                      dispatch({
                        type: 'SET_TRIAGE',
                        payload: {
                          ...triage,
                          urgencyLevel: level.toLowerCase(),
                        },
                      })
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-samu">
                <Activity className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-2xl">Incident Type</span>
                <span className="text-samu">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {incidentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`min-h-[64px] p-6 border-2 rounded-lg transition-all leading-relaxed text-xl font-medium ${
                      triage.incidentType === type
                        ? 'border-samu bg-samu-light text-samu-dark font-bold text-2xl'
                        : 'border-gray-200 hover:border-samu-light hover:bg-samu-light/50'
                    }`}
                    onClick={() =>
                      dispatch({
                        type: 'SET_TRIAGE',
                        payload: {
                          ...triage,
                          incidentType: type,
                        },
                      })
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-samu">
                <Thermometer className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-2xl">Pain Level</span>
                <span className="text-samu">*</span>
              </label>
              <div className="mt-12">
                <div className="relative">
                  <input
                    type="range"
                    required
                    min="0"
                    max="10"
                    step="1"
                    aria-label="Pain level from 1 (Mild) to 10 (Severe)"
                    aria-valuemin={0}
                    aria-valuemax={10}
                    aria-valuenow={Number(triage.painLevel)}
                    aria-valuetext={`Pain level ${triage.painLevel} out of 10`}
                    className="w-full h-4 bg-samu-light rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-samu/20 transition-all"
                    value={triage.painLevel}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_TRIAGE',
                        payload: {
                          ...triage,
                          painLevel: e.target.value,
                        },
                      })
                    }
                    style={{
                      background: `linear-gradient(to right, #003399 ${Number(triage.painLevel) * 10}%, #B3D1FF ${Number(triage.painLevel) * 10}%)`
                    }}
                  />
                  <div className="absolute -top-8 left-0 w-full flex justify-between text-sm font-medium">
                    <span className="text-green-600 translate-x-2">Mild</span>
                    <span className="text-yellow-600">Moderate</span>
                    <span className="text-red-600 -translate-x-2">Severe</span>
                  </div>
                  <div className="absolute -bottom-8 left-0 w-full flex justify-between text-xs">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <span
                        key={value}
                        className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                          Number(triage.painLevel) === value
                            ? 'bg-samu text-white font-bold'
                            : 'text-gray-500'
                        }`}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
                <label className="label flex items-center space-x-2 text-samu">
                  <Clock className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-2xl">Symptom Duration</span>
                  <span className="text-samu">*</span>
                </label>
                <div className="grid grid-cols-2 gap-12 mt-6">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-lg font-semibold text-gray-700 mb-4 block">Hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-[72px] w-[72px] border-2 rounded-xl transition-all text-3xl font-bold border-samu hover:bg-samu-light flex items-center justify-center"
                        onClick={() => {
                          const currentHours = parseInt(triage.durationHours) || 0;
                          if (currentHours > 0) {
                            dispatch({
                              type: 'SET_TRIAGE',
                              payload: {
                                ...triage,
                                durationHours: (currentHours - 1).toString(),
                              },
                            });
                          }
                        }}
                      >
                        <span className="transform translate-y-[-2px]">−</span>
                      </button>
                      <div className="flex-1 h-[72px] border-2 rounded-xl border-samu bg-samu-light text-samu-dark font-bold text-2xl flex items-center justify-center px-8">
                        {triage.durationHours || '0'}
                      </div>
                      <button
                        type="button"
                        className="h-[72px] w-[72px] border-2 rounded-xl transition-all text-3xl font-bold border-samu hover:bg-samu-light flex items-center justify-center"
                        onClick={() => {
                          const currentHours = parseInt(triage.durationHours) || 0;
                          dispatch({
                            type: 'SET_TRIAGE',
                            payload: {
                              ...triage,
                              durationHours: (currentHours + 1).toString(),
                            },
                          });
                        }}
                      >
                        <span className="transform translate-y-[-2px]">+</span>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-lg font-semibold text-gray-700 mb-4 block">Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-[72px] w-[72px] border-2 rounded-xl transition-all text-2xl font-bold border-samu hover:bg-samu-light flex items-center justify-center"
                        onClick={() => {
                          const currentMinutes = parseInt(triage.durationMinutes) || 0;
                          if (currentMinutes >= 5) {
                            dispatch({
                              type: 'SET_TRIAGE',
                              payload: {
                                ...triage,
                                durationMinutes: (currentMinutes - 5).toString(),
                              },
                            });
                          }
                        }}
                      >
                        <span className="transform translate-y-[-2px]">−</span>
                      </button>
                      <div className="flex-1 h-[72px] border-2 rounded-xl border-samu bg-samu-light text-samu-dark font-bold text-2xl flex items-center justify-center px-8">
                        {triage.durationMinutes || '0'}
                      </div>
                      <button
                        type="button"
                        className="h-[72px] w-[72px] border-2 rounded-xl transition-all text-2xl font-bold border-samu hover:bg-samu-light flex items-center justify-center"
                        onClick={() => {
                          const currentMinutes = parseInt(triage.durationMinutes) || 0;
                          if (currentMinutes < 55) {
                            dispatch({
                              type: 'SET_TRIAGE',
                              payload: {
                                ...triage,
                                durationMinutes: (currentMinutes + 5).toString(),
                              },
                            });
                          }
                        }}
                      >
                        <span className="transform translate-y-[-2px]">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <label className="label flex items-center space-x-2 text-samu">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-2xl">Critical Signs</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                  {criticalSigns.map((sign) => (
                    <button
                      key={sign}
                      type="button"
                      className={`min-h-[64px] p-4 border-2 rounded-xl transition-all leading-relaxed font-medium text-lg ${
                        triage.criticalSigns?.includes(sign)
                          ? 'border-samu bg-samu-light text-samu-dark'
                          : 'border-gray-200 hover:border-samu-light hover:bg-samu-light/50'
                      }`}
                      onClick={() => {
                        const signs = triage.criticalSigns || [];
                        const newSigns = signs.includes(sign)
                          ? signs.filter((s) => s !== sign)
                          : [...signs, sign];
                          dispatch({
                            type: 'SET_TRIAGE',
                            payload: {
                              ...triage,
                              criticalSigns: newSigns,
                            },
                          });
                      }}
                    >
                      {sign}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <label className="label flex items-center space-x-2 text-samu">
                  <Brain className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-2xl">Consciousness State</span>
                  <span className="text-samu">*</span>
                </label>
                <div className="grid grid-cols-3 gap-8 mt-6">
                  {consciousnessStates.map((state) => (
                    <button
                      key={state}
                      type="button"
                      className={`min-h-[72px] p-6 border-2 rounded-xl transition-all leading-relaxed font-medium text-lg ${
                        triage.consciousnessState === state
                          ? 'border-samu bg-samu-light text-samu-dark'
                          : 'border-gray-200 hover:border-samu-light hover:bg-samu-light/50'
                      }`}
                      onClick={() =>
                        dispatch({
                          type: 'SET_TRIAGE',
                          payload: {
                            ...triage,
                            consciousnessState: state,
                          },
                        })
                      }
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <label className="label flex items-center space-x-2 text-samu">
                  <Hospital className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                  <span className="text-2xl">Situation Description</span>
                </label>
                <textarea
                  className="input min-h-[200px] border-2 border-gray-200 rounded-xl transition-all focus:border-samu focus:ring-samu-light mt-6 text-2xl resize-none"
                  placeholder="Describe the emergency situation, patient profile, and any relevant details..."
                  value={triage.description}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TRIAGE',
                      payload: {
                        ...triage,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-center pt-10">
              <div className="flex space-x-6">
                <motion.button
                  aria-label="Find nearest hospital"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!triage.urgencyLevel || !triage.incidentType}
                  type="submit"
                  className="flex items-center space-x-3 bg-samu hover:bg-samu-dark text-white font-semibold px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-samu disabled:hover:scale-100 min-h-[72px] min-w-[240px] justify-center text-lg"
                >
                  <Hospital className="w-5 h-5" />
                  <span>Find Swift Route</span>
                </motion.button>
                
                {/* <motion.button
                  aria-label="Test API connection"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleApiTest}
                  className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all min-h-[72px] min-w-[240px] justify-center text-lg"
                >
                  <Zap className="w-5 h-5" />
                  <span>Test API Call</span>
                </motion.button> */}
              </div>
            </div>
          </form>
        </div>
      <MapView isVisible={state.showMap} />
    </motion.div>
  );
}


export { TriageForm }
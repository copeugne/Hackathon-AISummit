import React, { useCallback } from 'react';
import debounce from 'debounce';
import { motion } from 'framer-motion';
import { AlertCircle, Building2 as Hospital, Ambulance, Clock, Search, Activity, Brain, Thermometer, Zap } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { logEmergencyData } from '../utils/formLogger';
import { toast } from 'sonner';
import { HospitalMap } from './HospitalMap';
import { Modal } from './Modal';
import { MapView } from './MapView';

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
  const { triage } = state;
  const [showMap, setShowMap] = React.useState(false);
  
  const debouncedDispatch = useCallback(
    debounce((payload: any) => {
      dispatch({ type: 'SET_TRIAGE', payload });
    }, 300),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logEmergencyData(triage);
    setShowMap(true);
  };

const handleApiTest = async () => {
  try {
    const emergencyData = `
      Urgency Level: ${triage.urgencyLevel}
      Incident Type: ${triage.incidentType}
      Pain Level: ${triage.painLevel}/10
      Duration: ${triage.duration} ${triage.durationUnit}
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
          return response.json();
        })
        .then((data) => {
          console.log("API Response:", data);
          return data.response || "No response received from AI.";
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
      style={{
        pointerEvents: showMap ? 'none' : 'auto',
        opacity: showMap ? 0 : 1
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-samu-light rounded-xl">
            <Ambulance className="w-8 h-8 text-samu" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Emergency Dispatch Center</h2>
            <p className="text-sm text-gray-600">SAMU Emergency Response System</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-samu">SwiftDispatch</h3>
            <p className="text-sm text-gray-600">SAMU: Every minute counts.</p>
            <p className="text-sm text-gray-600">3 minutes is <i>too</i> long...</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Emergency Patient Information</h2>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: 'RESET_FORM' });
              toast.success('Form has been reset');
            }}
            className="flex items-center gap-2 px-6 py-3 text-white bg-samu hover:bg-samu-dark rounded-xl shadow-sm hover:shadow transition-all text-sm font-medium"
          >
            Reset Form
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-8">
            <div>
              <label className="label flex items-center space-x-2 text-samu">
                <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-lg">Urgency Level</span>
                <span className="text-samu">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['Critical', 'High', 'Moderate', 'Low'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`min-h-[48px] p-4 border-2 rounded-lg transition-all uppercase font-bold tracking-wide ${
                      triage.urgencyLevel === level
                        ? level === 'critical' 
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : level === 'high'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : level === 'moderate'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-samu-light hover:bg-samu-light/50'
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
                <span className="text-lg">Incident Type</span>
                <span className="text-samu">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                {incidentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`min-h-[64px] p-6 border-2 rounded-lg transition-all leading-relaxed ${
                      triage.incidentType === type
                        ? 'border-samu bg-samu-light text-samu-dark font-bold'
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
                <span className="text-lg">Pain Level</span>
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
                  <span className="text-lg">Symptom Duration</span>
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
                        className="h-[72px] w-[72px] border-2 rounded-xl transition-all text-2xl font-bold border-samu hover:bg-samu-light flex items-center justify-center"
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
                        className="h-[72px] w-[72px] border-2 rounded-xl transition-all text-2xl font-bold border-samu hover:bg-samu-light flex items-center justify-center"
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
                  <span className="text-lg">Critical Signs</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                  {criticalSigns.map((sign) => (
                    <button
                      key={sign}
                      type="button"
                      className={`min-h-[64px] p-4 border-2 rounded-xl transition-all leading-relaxed font-medium ${
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
                  <span className="text-lg">Consciousness State</span>
                  <span className="text-samu">*</span>
                </label>
                <div className="grid grid-cols-3 gap-8 mt-6">
                  {consciousnessStates.map((state) => (
                    <button
                      key={state}
                      type="button"
                      className={`min-h-[72px] p-6 border-2 rounded-xl transition-all leading-relaxed font-medium ${
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
                  <span className="text-lg">Situation Description</span>
                </label>
                <textarea
                  className="input min-h-[200px] border-2 border-gray-200 rounded-xl transition-all focus:border-samu focus:ring-samu-light mt-6 text-base resize-none"
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
                
                <motion.button
                  aria-label="Test API connection"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleApiTest}
                  className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all min-h-[72px] min-w-[240px] justify-center text-lg"
                >
                  <Zap className="w-5 h-5" />
                  <span>Test API Call</span>
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      <MapView isVisible={showMap} />
    </motion.div>
  );
}


export { TriageForm }
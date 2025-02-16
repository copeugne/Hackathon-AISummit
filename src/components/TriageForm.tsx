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
import { HospitalData } from '../types/index.ts';

const incidentTypes = [
  'Cardiovascular',
  'Respiratory',
  'Neurological',
  'Traumatic',
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
  'Active Bleeding'
];

export function TriageForm() {
  const { state, dispatch } = useForm();
  const { triage } = state;
  const [showMap, setShowMap] = React.useState(false);
  const [hospitals, setHospitals] = React.useState<HospitalData[]>([]);
  
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
            return response.json()
          })
          .then((data) => {
            
            if (data) {
              const ranking = JSON.parse(data.response);
              const formattedHospitals: HospitalData[] = Object.keys(ranking).map((key, index) => {
                const hospital = ranking[key];
                return {
                  id: index + 1, // Générer un ID unique basé sur l'index
                  name: hospital.name,
                  address: hospital.address,
				  coordinates: hospital.geo,
                  distance: "N/A", // Distance non fournie, à calculer si nécessaire
                  eta: "N/A" // ETA non fourni, valeur par défaut
                };
              });
			  console.log()
              setHospitals(formattedHospitals);
			  
            }
  
            // return rankedHosp
			console.log(hospitals)
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
  
  React.useEffect(() => {
	console.log("Hospitals mis à jour :", hospitals);
  }, [hospitals]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-8 sm:px-6"
      style={{
        pointerEvents: showMap ? 'none' : 'auto',
        opacity: showMap ? 0 : 1
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-red-100 rounded-xl">
            <Ambulance className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Emergency Dispatch Center</h2>
            <p className="text-sm text-gray-600">SAMU Emergency Response System</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
        <h2 className="text-center mb-8">
          Emergency Patient Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                <span>Urgency Level</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="input border-red-200 focus:border-red-400 focus:ring-red-100"
                value={triage.urgencyLevel}
                onChange={(e) => debouncedDispatch({
                  ...triage,
                  urgencyLevel: e.target.value,
                })}
              >
                <option value="">Select urgency level</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <Activity className="w-4 h-4" strokeWidth={2.5} />
                <span>Incident Type</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="input border-red-200 focus:border-red-400 focus:ring-red-100"
                value={triage.incidentType}
                onChange={(e) => debouncedDispatch({
                  ...triage,
                  incidentType: e.target.value,
                })}
              >
                <option value="">Select incident type</option>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <Thermometer className="w-4 h-4" strokeWidth={2.5} />
                <span>Pain Level</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="range"
                required
                min="1"
                max="10"
                step="1"
                className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
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
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Mild (1)</span>
                <span>Moderate (5)</span>
                <span>Severe (10)</span>
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <Clock className="w-4 h-4" strokeWidth={2.5} />
                <span>Symptom Duration</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  required
                  min="1"
                  className="input flex-1 border-red-200 focus:border-red-400 focus:ring-red-100"
                  placeholder="Duration"
                  value={triage.duration}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TRIAGE',
                      payload: {
                        ...triage,
                        duration: e.target.value,
                      },
                    })
                  }
                />
                <select
                  className="input w-32 border-red-200 focus:border-red-400 focus:ring-red-100"
                  value={triage.durationUnit}
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_TRIAGE',
                      payload: {
                        ...triage,
                        durationUnit: e.target.value,
                      },
                    })
                  }
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                <span>Critical Signs</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {criticalSigns.map((sign) => (
                  <label key={sign} className="flex items-center space-x-2 p-3 border-2 border-red-100 rounded-lg hover:bg-red-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-600 border-red-300 rounded focus:ring-red-500"
                      checked={triage.criticalSigns?.includes(sign)}
                      onChange={(e) => {
                        const signs = triage.criticalSigns || [];
                        const newSigns = e.target.checked
                          ? [...signs, sign]
                          : signs.filter((s) => s !== sign);
                        dispatch({
                          type: 'SET_TRIAGE',
                          payload: {
                            ...triage,
                            criticalSigns: newSigns,
                          },
                        });
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">{sign}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <Brain className="w-4 h-4" strokeWidth={2.5} />
                <span>Consciousness State</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {consciousnessStates.map((state) => (
                  <button
                    key={state}
                    type="button"
                    className={`p-3 border-2 rounded-lg transition-all ${
                      triage.consciousnessState === state
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-200 hover:bg-red-50'
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

            <div>
              <label className="label flex items-center space-x-2 text-red-600">
                <Hospital className="w-4 h-4" strokeWidth={2.5} />
                <span>Situation Description</span>
              </label>
              <textarea
                className="input min-h-[100px] border-red-200 focus:border-red-400 focus:ring-red-100"
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

          <div className="flex items-center justify-center pt-8">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!triage.urgencyLevel || !triage.incidentType}
                type="submit"
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 disabled:hover:scale-100"
              >
                <Hospital className="w-5 h-5" />
                <span>Find Swift Route</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleApiTest}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Zap className="w-5 h-5" />
                <span>Test API Call</span>
              </motion.button>
            </div>
          </div>
        </form>
      </div>
      <MapView isVisible={showMap} hospitals={hospitals} />
    </motion.div>
  );
}
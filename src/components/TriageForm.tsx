import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Building2 as Hospital, Ambulance, Clock, Search, Activity, Brain, Thermometer } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { HospitalMap } from './HospitalMap';
import { Modal } from './Modal';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8 sm:px-6"
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
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TRIAGE',
                    payload: {
                      ...triage,
                      urgencyLevel: e.target.value,
                    },
                  })
                }
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
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TRIAGE',
                    payload: {
                      ...triage,
                      incidentType: e.target.value,
                    },
                  })
                }
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
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Hospital Redirection Suggestions"
      >
        <div className="space-y-6">
          <HospitalMap />

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Suggested Hospitals:</h4>
            {[
              {
                name: 'Hôpital Pitié-Salpêtrière',
                address: '47-83 Boulevard de l\'Hôpital, 75013 Paris',
                distance: '2.5 km',
                eta: '8 min',
                pin: 1
              },
              {
                name: 'Hôpital Européen Georges-Pompidou',
                address: '20 Rue Leblanc, 75015 Paris',
                distance: '4.2 km',
                eta: '12 min',
                pin: 2
              },
              {
                name: 'Hôpital Saint-Antoine',
                address: '184 Rue du Faubourg Saint-Antoine, 75012 Paris',
                distance: '3.8 km',
                eta: '10 min',
                pin: 3
              }
            ].map((hospital, index) => (
              <div
                key={hospital.name}
                className="p-4 border-2 border-red-100 rounded-lg hover:bg-red-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {hospital.pin}
                      </div>
                      <h5 className="font-semibold text-gray-900">{hospital.name}</h5>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">{hospital.distance}</p>
                    <p className="text-xs text-gray-500 mt-1">ETA: {hospital.eta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
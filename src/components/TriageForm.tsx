import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Stethoscope, Clock, ArrowLeft, Search, HeartPulse, AlertCircle, Lock, Heart } from 'lucide-react';
import { useForm } from '../context/FormContext';
import { Modal } from './Modal';

const cardiacSymptoms = [
  'Chest pain or discomfort',
  'Shortness of breath',
  'Heart palpitations/irregular heartbeat',
  'Dizziness or lightheadedness',
  'Fainting spells',
  'Swelling in legs, ankles, or feet',
  'Fatigue or unusual tiredness',
  'Rapid or slow heart rate',
  'Pain in neck, jaw, throat, or upper abdomen',
  'Other cardiac symptoms'
];

export function TriageForm() {
  const { state, dispatch } = useForm();
  const { triage } = state;
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const waitTimes = {
    typical: 45,
    inPerson: {
      routine: 20,
      urgent: 7,
    },
    teleconsultation: 3,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-xl">
            <AlertCircle className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Current Wait Times</h2>
            <p className="text-sm text-gray-600">Typical wait for a Cardiologist appointment in Île-de-France</p>
          </div>
        </div>
        <div className="text-center p-6 bg-accent/5 rounded-xl border-2 border-accent/10">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <HeartPulse className="w-5 h-5 text-accent" strokeWidth={2.5} />
            <p className="text-sm font-medium text-accent">Cardiologist, Île-de-France:</p>
          </div>
          <p className="text-5xl font-extrabold tracking-tight text-accent">{waitTimes.typical} Days</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
        <h2 className="text-center mb-8">
          Find Your Appointment Options
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <div>
              <label className="label flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span>Region</span>
              </label>
              <div className="relative">
                <select
                  disabled
                  className="input bg-gray-50/80 text-gray-500 border-gray-200/70 cursor-not-allowed opacity-80"
                  value={triage.region}
                >
                  <option value="Île-de-France">Île-de-France</option>
                </select>
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span>Specialty</span>
              </label>
              <div className="relative">
                <select
                  disabled
                  className="input bg-gray-50/80 text-gray-500 border-gray-200/70 cursor-not-allowed opacity-80"
                  value={triage.specialty}
                >
                  <option value="Cardiologist">Cardiologist</option>
                </select>
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              </div>
            </div>

            <div>
              <label className="label flex items-center space-x-2">
                <Heart className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span>Cardiac Symptoms</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="input"
                value={triage.symptom}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TRIAGE',
                    payload: {
                      ...triage,
                      symptom: e.target.value,
                    },
                  })
                }
              >
                <option value="">Please select a symptom</option>
                {cardiacSymptoms.map((symptom) => (
                  <option key={symptom} value={symptom}>
                    {symptom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" strokeWidth={2.5} />
                <span>Urgency Level</span>
                <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="input"
                value={triage.urgencyLevel}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_TRIAGE',
                    payload: {
                      ...triage,
                      urgencyLevel: e.target.value as 'routine' | 'urgent',
                    },
                  })
                }
              >
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8">
            <button
              type="button"
              onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
              className="flex items-center space-x-2 px-6 py-2 text-primary hover:text-primary-dark font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!triage.symptom}
              type="submit"
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:scale-100"
            >
              <Search className="w-4 h-4" />
              <span>Find My Options</span>
            </motion.button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        waitTimes={waitTimes}
        isRoutine={triage.urgencyLevel === 'routine'}
      />
    </motion.div>
  );
}
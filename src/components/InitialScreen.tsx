import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Building2 as Hospital, Map, ArrowRight } from 'lucide-react';
import { useForm } from '../context/FormContext';

export function InitialScreen() {
  const { dispatch } = useForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <h1 className="mb-6 bg-gradient-to-r from-red-900 to-red-600 bg-clip-text text-transparent">
          SwiftDispatch: <span className="text-accent font-black">Optimizing SAMU Emergency Response</span>
        </h1>
        <p className="text-[26px] font-normal text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Helping SAMU Regulators Quickly Direct Patients to the Best Hospital
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => dispatch({ type: 'SET_STEP', payload: 2 })}
        className="mx-auto flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <span>Start Emergency Dispatch</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {emergencyFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card bg-white border-l-4 border-red-500"
          >
            <div className="p-3 bg-red-50 rounded-xl w-fit mb-4">
              <feature.icon className="w-8 h-8 text-red-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

const emergencyFeatures = [
  {
    icon: AlertCircle,
    title: 'Critical Response',
    description: 'Rapid assessment and hospital redirection for emergency cases',
  },
  {
    icon: Hospital,
    title: 'Hospital Network',
    description: 'Instant access to hospital capacity and specialty information',
  },
  {
    icon: Map,
    title: 'Smart Routing',
    description: 'Optimized patient routing based on emergency type and hospital locations',
  },
];
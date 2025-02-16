import React from 'react';
import { motion } from 'framer-motion';
import { Building2 as Hospital, Navigation2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface RouteInfo {
  distance: string;
  eta: string;
}

interface HospitalListProps {
  isOpen: boolean;
  hospitals: Array<{
    id: number;
    name: string;
    address: string;
    distance: string;
    eta: string;
    routeInfo?: {
      distance: string;
      eta: string;
    };
  }>;
  onHospitalSelect?: (id: number) => void;
}

export function HospitalList({ isOpen, hospitals, onHospitalSelect }: HospitalListProps) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: isOpen ? 0 : '100%', opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className={cn(
        'fixed right-8 top-8 h-[calc(100vh-4rem)] w-[500px]',
        'bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-200 overflow-hidden',
        'flex flex-col z-50'
      )}
    >
      <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Hospital className="w-5 h-5 text-samu" />
          Recommended Hospitals
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {hospitals.map((hospital) => (
          <motion.button
            key={hospital.id}
            onClick={() => onHospitalSelect?.(hospital.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 bg-white/80 backdrop-blur-sm border-2 border-gray-100 rounded-xl hover:border-red-200 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-samu text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {hospital.id}
                  </div>
                  <h4 className="font-bold text-gray-900 text-left text-xl">{hospital.name}</h4>
                </div>
                <p className="text-lg text-gray-600 text-left font-medium">{hospital.address}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-lg font-medium">
                {/* <Navigation2 className="w-4 h-4 text-samu" /> */}
                {/* <span className="text-gray-700">
                  {hospital.routeInfo?.distance === 'Error' ? (
                    <span className="text-samu">Service unavailable</span>
                  ) : hospital.routeInfo?.distance === 'Unavailable' ? (
                    <span className="text-orange-500">No route found</span>
                  ) : hospital.routeInfo?.distance || (
                    <span className="text-gray-400">Calculating...</span>
                  ) ? (
                    <span className={cn(
                      parseFloat(hospital.routeInfo?.distance) <= 2 ? 'text-urgency-low' :
                      parseFloat(hospital.routeInfo?.distance) <= 5 ? 'text-urgency-medium' :
                      parseFloat(hospital.routeInfo?.distance) <= 10 ? 'text-urgency-high' :
                      'text-urgency-critical'
                    )}>
                      {hospital.routeInfo?.distance}
                    </span>
                  ) : null}
                </span> */}
              </div>
              <div className="flex items-center gap-2 text-lg font-medium">
                {/* <Clock className="w-4 h-4 text-samu" /> */}
                {/* <span className="text-gray-700">
                  ETA: {hospital.routeInfo?.eta === 'Error' ? (
                    <span className="text-samu">Service unavailable</span>
                  ) : hospital.routeInfo?.eta === 'Unavailable' ? (
                    <span className="text-orange-500">No route found</span>
                  ) : hospital.routeInfo?.eta || (
                    <span className="text-gray-400">Calculating...</span>
                  ) ? (
                    <span className={cn(
                      parseInt(hospital.routeInfo?.eta) <= 10 ? 'text-urgency-low' :
                      parseInt(hospital.routeInfo?.eta) <= 15 ? 'text-urgency-medium' :
                      parseInt(hospital.routeInfo?.eta) <= 25 ? 'text-urgency-high' :
                      'text-urgency-critical'
                    )}>
                      {hospital.routeInfo?.eta}
                    </span>
                  ) : null}
                </span> */}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
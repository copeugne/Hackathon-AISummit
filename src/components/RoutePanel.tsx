import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Navigation2, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface RoutePanelProps {
  isOpen: boolean;
  route: {
    distance: string;
    eta: string;
  };
}

export function RoutePanel({ isOpen, route }: RoutePanelProps) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: isOpen ? 0 : '100%', opacity: isOpen ? 1 : 0 }}
      transition={{ type: 'spring', damping: 20 }}
      className={cn(
        'fixed right-0 top-0 h-screen w-[35vw] min-w-[400px] max-w-[500px]',
        'bg-white shadow-2xl border-l border-gray-200 p-6 overflow-y-auto'
      )}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Route Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-samu-light rounded-lg">
              <div className="flex items-center gap-2 text-samu text-lg">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">ETA</span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                <span className={cn(
                  parseInt(route.eta) <= 10 ? 'text-urgency-low' :
                  parseInt(route.eta) <= 15 ? 'text-urgency-medium' :
                  parseInt(route.eta) <= 25 ? 'text-urgency-high' :
                  'text-urgency-critical'
                )}>
                  {route.eta}
                </span>
              </p>
            </div>
            
            <div className="p-4 bg-samu-light rounded-lg">
              <div className="flex items-center gap-2 text-samu text-lg">
                <Navigation2 className="w-4 h-4" />
                <span className="font-semibold">Distance</span>
              </div>
              <p className="mt-1 text-2xl font-bold">
                <span className={cn(
                  parseFloat(route.distance) <= 2 ? 'text-urgency-low' :
                  parseFloat(route.distance) <= 5 ? 'text-urgency-medium' :
                  parseFloat(route.distance) <= 10 ? 'text-urgency-high' :
                  'text-urgency-critical'
                )}>
                  {route.distance}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
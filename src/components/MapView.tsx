import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { HospitalMap } from './HospitalMap';
import { HospitalList } from './HospitalList';
import { RoutePanel } from './RoutePanel';
import { HospitalData } from '../types';
import { useForm } from '../context/FormContext';

export function MapView({ isVisible }: {
  isVisible: boolean;
}) {
  const { dispatch } = useForm();
  const [selectedHospital, setSelectedHospital] = React.useState<number | null>(null);
  const [route, setRoute] = React.useState<any>(null);
  const [hospitals, setHospitals] = React.useState<HospitalData[]>([]);

  React.useEffect(() => {
    if (isVisible) {
      const savedHospitals = window.localStorage.getItem('hospitals');
      if (savedHospitals) {
        setHospitals(JSON.parse(savedHospitals));
      }
    }
  }, [isVisible]);

  // Mémoïse les callbacks pour éviter des re-rendus inutiles
  const handleHospitalSelect = React.useCallback((id: number) => {
    setSelectedHospital(id);
  }, []);

  const handleAllRoutesCalculated = React.useCallback((routes: Record<number, { distance: string; eta: string }>) => {
    setHospitals(prevHospitals =>
      prevHospitals.map(hospital => ({
        ...hospital,
        distance: routes[hospital.id]?.distance || hospital.distance,
        eta: routes[hospital.id]?.eta || hospital.eta
      }))
    );
  }, [setHospitals]);

  const handleRouteCalculated = React.useCallback((calculatedRoute: any) => {
    setRoute(calculatedRoute);
    setHospitals(prevHospitals =>
      prevHospitals.map(hospital =>
        hospital.id === selectedHospital
          ? {
              ...hospital,
              distance: calculatedRoute.distance,
              eta: calculatedRoute.eta
            }
          : hospital
      )
    );
  }, [selectedHospital, setHospitals]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0, display: isVisible ? 'block' : 'none' }}
      transition={{ duration: 0.3 }}
      style={{
        pointerEvents: isVisible ? 'auto' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
      }}
      className="bg-gray-50"
    >
      <div className="relative w-full h-full">
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => dispatch({ type: 'SET_MAP_VISIBILITY', payload: false })}
          className="absolute top-8 left-8 z-[1000] flex items-center gap-3 px-8 py-6 bg-white/90 hover:bg-white text-gray-900 rounded-xl shadow-lg backdrop-blur-sm border-2 border-gray-100 transition-all font-medium text-2xl"
          aria-label="Return to form"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Form</span>
        </motion.button>
        <HospitalMap 
          selectedHospital={selectedHospital}
          onRouteCalculated={handleRouteCalculated}
          onAllRoutesCalculated={handleAllRoutesCalculated}
        />
        <HospitalList
          isOpen={isVisible}
          hospitals={hospitals}
          onHospitalSelect={handleHospitalSelect}
        />
        {route && (
          <RoutePanel
            isOpen={!!selectedHospital}
            route={{
              distance: route.distance,
              eta: route.eta
            }}
          />
        )}
      </div>
    </motion.div>
  );
}


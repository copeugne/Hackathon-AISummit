import React from 'react';
import { motion } from 'framer-motion';
import { HospitalMap } from './HospitalMap';
import { HospitalList } from './HospitalList';
import { RoutePanel } from './RoutePanel';
import { HospitalData } from '../types/index.ts';

interface MapViewProps {
  isVisible: boolean;
  hospitals: HospitalData[];
}

export function MapView({ isVisible, hospitals, setHospitals }: {
  isVisible: MapViewProps,
  hospitals: HospitalData[], 
  setHospitals:  React.Dispatch<React.SetStateAction<HospitalData[]>>,
}) {
  const [selectedHospital, setSelectedHospital] = React.useState<number | null>(null);
  const [route, setRoute] = React.useState<any>(null);
  // const [hospitalsList, setHospitalsList] = React.useState<HospitalData[]>(hospitals);

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
  }, []);

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
  }, [selectedHospital]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        pointerEvents: isVisible ? 'auto' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
      className="bg-gray-50"
    >
      <div className="relative w-full h-full">
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


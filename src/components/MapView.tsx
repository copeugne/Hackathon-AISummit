import React from 'react';
import { motion } from 'framer-motion';
import { HospitalMap } from './HospitalMap';
import { HospitalList } from './HospitalList';
import { RoutePanel } from './RoutePanel';
import { HospitalData } from '../types/index.ts';

interface RouteInfo {
  distance: string;
  eta: string;
}

interface MapViewProps {
  isVisible: boolean;
}

export function MapView({ isVisible, hospitals }: {isVisible: MapViewProps, hospitals: HospitalData[]}) {
  const [selectedHospital, setSelectedHospital] = React.useState<number | null>(null);
  const [route, setRoute] = React.useState<any>(null);
  const [hospitalsList, setHospitalsList] = React.useState<HospitalData[]>(hospitals);

  // Memoize these callbacks to avoid unnecessary re-renders / effect re-triggers in children
  const handleHospitalSelect = React.useCallback((id: number) => {
    setSelectedHospital(id);
  }, []);

  const handleAllRoutesCalculated = React.useCallback((routes: Record<number, RouteInfo>) => {
    setHospitalsList(prevHospitals =>
      prevHospitals.map(hospital => ({
        ...hospital,
        routeInfo: routes[hospital.id]
      }))
    );
  }, []);

  const handleRouteCalculated = React.useCallback((calculatedRoute: any) => {
    setRoute(calculatedRoute);
    setHospitalsList(prevHospitals =>
      prevHospitals.map(hospital =>
        hospital.id === selectedHospital
          ? {
              ...hospital,
              routeInfo: {
                distance: calculatedRoute.distance,
                eta: calculatedRoute.eta
              }
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
          hospitals={hospitalsList}
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

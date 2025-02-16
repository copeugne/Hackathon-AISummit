import React from 'react';
import { motion } from 'framer-motion';
import { HospitalMap } from './HospitalMap';
import { HospitalList } from './HospitalList';
import { RoutePanel } from './RoutePanel';

interface RouteInfo {
  distance: string;
  eta: string;
}

interface MapViewProps {
  isVisible: boolean;
}

let hospitals = [
  {
    id: 1,
    name: 'Hôpital Pitié-Salpêtrière',
    address: "47-83 Boulevard de l'Hôpital, 75013 Paris",
    distance: '2.5 km',
    eta: '8 min'
  },
  {
    id: 2,
    name: 'Hôpital Européen Georges-Pompidou',
    address: '20 Rue Leblanc, 75015 Paris',
    distance: '4.2 km',
    eta: '12 min'
  },
  {
    id: 3,
    name: 'Hôpital Saint-Antoine',
    address: '184 Rue du Faubourg Saint-Antoine, 75012 Paris',
    distance: '3.8 km',
    eta: '10 min'
  }
];

export function MapView({ isVisible }: MapViewProps) {
  const [selectedHospital, setSelectedHospital] = React.useState<number | null>(null);
  const [route, setRoute] = React.useState<any>(null);
  const [hospitalsList, setHospitalsList] = React.useState<typeof hospitals>(hospitals);

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

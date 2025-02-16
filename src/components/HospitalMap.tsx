import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet-routing-machine';
import { Building2 as Hospital } from 'lucide-react';
import { HospitalData } from '../types';

const USER_LOCATION: [number, number] = [48.90074247915061, 2.2849771153414733];

const redIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const blueIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface RouteInfo {
  distance: string;
  eta: string;
}

interface RoutingMachineProps {
  selectedHospital: HospitalData | null;
  onRouteCalculated?: (route: any) => void;
}

function RoutingMachine({ selectedHospital, onRouteCalculated }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  const getCoordinates = (coords: string | [number, number]): [number, number] => {
    if (Array.isArray(coords)) return coords;
    const [lat, lon] = coords.split(',').map(Number);
    return [lat, lon];
  };

  useEffect(() => {
    if (!routingControlRef.current) {
      const hospitalCoords = selectedHospital ? getCoordinates(selectedHospital.coordinates) : USER_LOCATION;
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(USER_LOCATION[0], USER_LOCATION[1]),
          L.latLng(hospitalCoords[0], hospitalCoords[1])
        ],
        lineOptions: {
          styles: [{ color: '#003399', opacity: 1, weight: 6 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0
        },
        router: (L.Routing as any).osrmv1({
          serviceUrl: 'https://routing.openstreetmap.de/routed-car/route/v1',
          profile: 'driving',
          useHints: false
        }),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        createMarker: () => null,
        routeWhileDragging: false,
        show: false,
        collapsible: false
      })
        .on('routingerror', (e) => {
          console.error('Routing error:', e.error);
        })
        .on('routesfound', (e: any) => {
          const route = e.routes[0];
          const bounds = new L.LatLngBounds(route.waypoints.map((w: any) => w.latLng));
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });

          const distanceInKm = (route.summary.totalDistance / 1000).toFixed(1);
          const timeInMinutes = Math.round(route.summary.totalTime / 60);
          const hours = Math.floor(timeInMinutes / 60);
          const minutes = timeInMinutes % 60;
          const formattedTime =
            hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes} min`;

          onRouteCalculated?.({ distance: `${distanceInKm} km`, eta: formattedTime });
        })
        .addTo(map);
    } else {
      if (selectedHospital) {
        const hospitalCoords = getCoordinates(selectedHospital.coordinates);
        routingControlRef.current.setWaypoints([
          L.latLng(USER_LOCATION[0], USER_LOCATION[1]),
          L.latLng(hospitalCoords[0], hospitalCoords[1])
        ]);
      } else {
        routingControlRef.current.setWaypoints([
          L.latLng(USER_LOCATION[0], USER_LOCATION[1]),
          L.latLng(USER_LOCATION[0], USER_LOCATION[1])
        ]);
      }
    }
  }, [map, selectedHospital, onRouteCalculated]);

  return null;
}

interface HospitalMapProps {
  selectedHospital: number | null;
  onRouteCalculated?: (route: any) => void;
  onAllRoutesCalculated?: (routes: Record<number, RouteInfo>) => void;
}

export function HospitalMap({ selectedHospital, onRouteCalculated, onAllRoutesCalculated }: HospitalMapProps) {
  const selectedHospitalData = React.useMemo(
    () => {
      const savedHospitals = window.localStorage.getItem('hospitals');
      if (!savedHospitals) return null;
      const hospitals = JSON.parse(savedHospitals) as HospitalData[];
      return hospitals.find(h => h.id === selectedHospital);
    },
    [selectedHospital]
  );

  const [hospitals, setHospitals] = React.useState<HospitalData[]>([]);

  React.useEffect(() => {
    const savedHospitals = window.localStorage.getItem('hospitals');
    if (savedHospitals) {
      setHospitals(JSON.parse(savedHospitals));
    }
  }, []);

  useEffect(() => {
    const calculateAllRoutes = async () => {
      if (hospitals.length === 0) return;

      const routePromises = hospitals.map(async (hospital) => {
        const coords = hospital.coordinates;
        const [lat2, lon2] = Array.isArray(coords) ? coords : coords.split(',').map(Number);
        const lat1 = USER_LOCATION[0];
        const lon1 = USER_LOCATION[1];
        
        // Simple distance calculation (this is a rough approximation)
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Mock ETA calculation (assuming average speed of 30 km/h in city)
        const timeInMinutes = Math.ceil((distance / 30) * 60);
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        
        // Format the output
        const formattedDistance = `${distance.toFixed(1)} km`;
        const formattedTime = hours > 0
          ? `${hours}:${minutes.toString().padStart(2, '0')}`
          : `${minutes} min`;

        return {
          hospitalId: hospital.id,
          routeInfo: {
            distance: formattedDistance,
            eta: formattedTime
          }
        };
      });

      const results = await Promise.all(routePromises);
      const routesMap: Record<number, RouteInfo> = {};
      results.forEach(result => {
        if (result && result.hospitalId) {
          routesMap[result.hospitalId] = result.routeInfo;
        }
      });
      onAllRoutesCalculated?.(routesMap);
    };

    calculateAllRoutes();
  }, [hospitals, onAllRoutesCalculated]);

  return (
    <div className="relative">
      <MapContainer
        className="h-screen w-screen z-10"
        center={[48.8566, 2.3522]}
        zoom={12}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <Marker position={USER_LOCATION} icon={blueIcon}>
          <Popup className="hospital-popup">
            <div className="p-2">
              <h3 className="font-semibold text-gray-900 text-lg">Your Location</h3>
              <p className="text-base text-gray-600 mt-1">Current position</p>
            </div>
          </Popup>
        </Marker>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitals.map((hospital) => {
          const coords = Array.isArray(hospital.coordinates) 
            ? hospital.coordinates 
            : hospital.coordinates.split(',').map(Number) as [number, number];
          return (
          <Marker key={hospital.id} position={coords} icon={redIcon}>
            <Popup className="hospital-popup">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Hospital className="w-4 h-4 text-samu" />
                  <h3 className="font-semibold text-gray-900 text-lg">{hospital.name}</h3>
                </div>
                <p className="text-base text-gray-600">{hospital.address}</p>
                <div className="mt-2">
                  <p className="text-samu font-medium text-base">{hospital.distance}</p>
                  <p className="text-gray-500 text-base">ETA: {hospital.eta}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        )})}
        <RoutingMachine 
          selectedHospital={selectedHospitalData || null} 
          onRouteCalculated={onRouteCalculated}
        />
      </MapContainer>
    </div>
  );
}
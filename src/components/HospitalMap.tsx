import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet-routing-machine';
import { Building2 as Hospital } from 'lucide-react';

const USER_LOCATION: [number, number] = [48.90074247915061, 2.2849771153414733];
const OSRM_SERVICE_URL = 'https://router.project-osrm.org/route/v1/driving';

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

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  eta: string;
  coordinates: [number, number];
}

interface RouteInfo {
  distance: string;
  eta: string;
}

interface HospitalWithRoute extends Hospital {
  routeInfo?: RouteInfo;
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'Hôpital Pitié-Salpêtrière',
    address: "47-83 Boulevard de l'Hôpital, 75013 Paris",
    distance: '2.5 km',
    eta: '8 min',
    coordinates: [48.8384, 2.3653]
  },
  {
    id: 2,
    name: 'Hôpital Européen Georges-Pompidou',
    address: '20 Rue Leblanc, 75015 Paris',
    distance: '4.2 km',
    eta: '12 min',
    coordinates: [48.8391, 2.2739]
  },
  {
    id: 3,
    name: 'Hôpital Saint-Antoine',
    address: '184 Rue du Faubourg Saint-Antoine, 75012 Paris',
    distance: '3.8 km',
    eta: '10 min',
    coordinates: [48.8498, 2.3826]
  }
];

interface RoutingMachineProps {
  selectedHospital: Hospital | null;
  onRouteCalculated?: (route: any) => void;
}

function RoutingMachine({ selectedHospital, onRouteCalculated }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!routingControlRef.current) {
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(USER_LOCATION[0], USER_LOCATION[1]),
          selectedHospital
            ? L.latLng(selectedHospital.coordinates[0], selectedHospital.coordinates[1])
            : L.latLng(USER_LOCATION[0], USER_LOCATION[1])
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
        routingControlRef.current.setWaypoints([
          L.latLng(USER_LOCATION[0], USER_LOCATION[1]),
          L.latLng(selectedHospital.coordinates[0], selectedHospital.coordinates[1])
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
    () => hospitals.find(h => h.id === selectedHospital),
    [selectedHospital]
  );

  useEffect(() => {
    const calculateAllRoutes = async () => {
      const routePromises = hospitals.map(async (hospital) => {
        const coordinates = `${USER_LOCATION[1]},${USER_LOCATION[0]};${hospital.coordinates[1]},${hospital.coordinates[0]}`;
        const url = `${OSRM_SERVICE_URL}/${coordinates}?overview=false`;
        
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.routes && data.routes[0]) {
            const route = data.routes[0];
            const distanceInKm = (route.distance / 1000).toFixed(1);
            const timeInMinutes = Math.round(route.duration / 60);
            const hours = Math.floor(timeInMinutes / 60);
            const minutes = timeInMinutes % 60;
            const formattedTime = hours > 0
              ? `${hours}:${minutes.toString().padStart(2, '0')}`
              : `${minutes} min`;
            return {
              hospitalId: hospital.id,
              routeInfo: {
                distance: `${distanceInKm} km`,
                eta: formattedTime
              }
            };
          }
          console.error('No routes found for hospital:', hospital.id);
          return {
            hospitalId: hospital.id,
            routeInfo: {
              distance: 'Unavailable',
              eta: 'Unavailable'
            }
          };
        } catch (error) {
          console.error(`Error calculating route for hospital ${hospital.id}:`, error);
          return {
            hospitalId: hospital.id,
            routeInfo: {
              distance: 'Error',
              eta: 'Error'
            }
          };
        }
      });

      const results = await Promise.all(routePromises);
      const routesMap: Record<number, RouteInfo> = {};
      results.forEach(result => {
        if (result) routesMap[result.hospitalId] = result.routeInfo;
      });
      onAllRoutesCalculated?.(routesMap);
    };

    calculateAllRoutes();
  }, [onAllRoutesCalculated]);

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
              <h3 className="font-semibold text-gray-900">Your Location</h3>
              <p className="text-sm text-gray-600 mt-1">Current position</p>
            </div>
          </Popup>
        </Marker>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="transition-opacity duration-300"
          eventHandlers={{
            loading: (e) => { e.target.getContainer().style.opacity = '0'; },
            load: (e) => { e.target.getContainer().style.opacity = '1'; }
          }}
        />
        {hospitals.map((hospital) => (
          <Marker key={hospital.id} position={hospital.coordinates} icon={redIcon}>
            <Popup className="hospital-popup">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <Hospital className="w-4 h-4 text-samu" />
                  <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{hospital.address}</p>
                <div className="mt-2 text-sm">
                  <p className="text-samu font-medium">{hospital.distance}</p>
                  <p className="text-gray-500">ETA: {hospital.eta}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <RoutingMachine 
          selectedHospital={selectedHospitalData || null} 
          onRouteCalculated={onRouteCalculated}
        />
      </MapContainer>
    </div>
  );
}
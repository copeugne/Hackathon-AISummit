import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Building2 as Hospital } from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: string;
  eta: string;
  coordinates: [number, number];
}

const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'Hôpital Pitié-Salpêtrière',
    address: '47-83 Boulevard de l\'Hôpital, 75013 Paris',
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

const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function HospitalMap() {
  return (
    <MapContainer
      style={{ height: '400px', width: '100%' }}
      center={[48.8566, 2.3522]}
      zoom={12}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hospitals.map((hospital) => (
        <Marker
          key={hospital.id}
          position={hospital.coordinates}
          icon={customIcon}
        >
          <Popup>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <Hospital className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-gray-900">{hospital.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{hospital.address}</p>
              <div className="mt-2 text-sm">
                <p className="text-red-600 font-medium">{hospital.distance}</p>
                <p className="text-gray-500">ETA: {hospital.eta}</p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
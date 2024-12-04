import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';
import axios from 'axios';
import ReporteForm from './ReporteForm'; // Importa el formulario

const MapaHidalgo = () => {
  const [municipios, setMunicipios] = useState([]);
  const [puntos, setPuntos] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/municipios');
        const municipiosData = response.data.map((item) => ({
          ...item,
          geom: JSON.parse(item.geom),
        }));
        setMunicipios(municipiosData);
      } catch (error) {
        console.error('Error al cargar los municipios:', error);
      }
    };
    fetchMunicipios();
  }, []);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/padron');
        const puntosData = response.data.map((item) => ({
          ...item,
          geom: JSON.parse(item.geom),
        }));
        setPuntos(puntosData);
      } catch (error) {
        console.error('Error al cargar los puntos de desabasto:', error);
      }
    };

    fetchPuntos();
  }, []);

  useEffect(() => {
    if (municipios.length > 0 && mapRef.current) {
      const bounds = municipios.flatMap((municipio) =>
        municipio.geom.type === 'MultiPolygon'
          ? municipio.geom.coordinates.flat(2).map(([lng, lat]) => [lat, lng])
          : municipio.geom.coordinates[0].map(([lng, lat]) => [lat, lng])
      );
      mapRef.current.fitBounds(bounds);
    }
  }, [municipios]);

  return (
    <div>
      <MapContainer
        ref={mapRef}
        center={[20.1167, -98.7333]}
        zoom={12}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={true}
        minZoom={8}
        maxZoom={18}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {municipios.map((municipio) =>
          municipio.geom.type === 'MultiPolygon'
            ? municipio.geom.coordinates.map((polygon, index) => (
                <Polygon
                  key={`${municipio.id}-${index}`}
                  positions={polygon[0].map(([lng, lat]) => [lat, lng])}
                  pathOptions={{
                    color: 'blue',
                    fillColor: 'lightblue',
                    fillOpacity: 0.5,
                  }}
                >
                  <Tooltip>{municipio.nombre || `Municipio ID: ${municipio.id}`}</Tooltip>
                </Polygon>
              ))
            : (
              <Polygon
                key={municipio.id}
                positions={municipio.geom.coordinates[0].map(([lng, lat]) => [lat, lng])}
                pathOptions={{
                  color: 'blue',
                  fillColor: 'lightblue',
                  fillOpacity: 0.5,
                }}
              >
                <Tooltip>{municipio.nombre || `Municipio ID: ${municipio.id}`}</Tooltip>
              </Polygon>
            )
        )}

        {puntos.map((punto) => (
          <CircleMarker
            key={punto.id}
            center={[punto.geom.coordinates[1], punto.geom.coordinates[0]]}
            radius={5}
            pathOptions={{
              color: 'red',
              fillColor: 'red',
              fillOpacity: 0.8,
            }}
          >
            <Tooltip>
              <strong>{punto.nombre}</strong> <br />
              {punto.domicilio} <br />
              {punto.des_munici}, {punto.des_coloni}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Agrega el formulario aquí */}
      <ReporteForm />
    </div>
  );
};

export default MapaHidalgo;

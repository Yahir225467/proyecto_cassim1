import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-markercluster'; // Para clustering de marcadores
import L from 'leaflet';

// Configurar el icono de Marker para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaHidalgo = () => {
  const [municipios, setMunicipios] = useState([]); // Municipios
  const [puntos, setPuntos] = useState([]); // Puntos de referencia
  const [page, setPage] = useState(1); // Paginación
  const [hasMore, setHasMore] = useState(true); // Verificar si hay más puntos
  const [zoomLevel, setZoomLevel] = useState(8); // Nivel de zoom

  // Cargar los municipios
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/municipios');
        const municipiosData = response.data.map((item) => ({
          ...item,
          geom: JSON.parse(item.geom), // Convertir el GeoJSON
        }));
        setMunicipios(municipiosData);
      } catch (error) {
        console.error('Error al cargar los municipios:', error);
      }
    };
    fetchMunicipios();
  }, []);

  // Cargar los puntos con paginación
  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/padron?page=${page}&limit=100`);
        const puntosData = response.data.map((item) => ({
          ...item,
          geom: JSON.parse(item.geom), // Convertir el GeoJSON
        }));
        setPuntos((prev) => [...prev, ...puntosData]); // Agregar los nuevos puntos al estado
        if (puntosData.length < 100) setHasMore(false); // No hay más puntos si la respuesta tiene menos de 100
      } catch (error) {
        console.error('Error al cargar los puntos de desabasto:', error);
      }
    };

    fetchPuntos();
  }, [page]);

  // Función para manejar el zoom del mapa
  const handleZoom = (e) => {
    setZoomLevel(e.target.getZoom());
  };

  return (
    <div>
      <MapContainer
        center={[20.1167, -98.7333]} // Coordenadas centradas en Hidalgo
        zoom={zoomLevel}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={true}
        minZoom={8}
        maxZoom={15}
        onZoomEnd={handleZoom}
      >
        {/* Capa base */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Dibujar municipios */}
        {municipios.length > 0 && municipios.map((municipio) => (
          <Polygon
            key={municipio.id}
            positions={municipio.geom.coordinates[0].map(([lng, lat]) => [lat, lng])} // Leaflet usa [lat, lng]
            pathOptions={{
              color: 'blue',
              fillColor: 'lightblue',
              fillOpacity: 0.5,
            }}
          >
            <Tooltip>{municipio.nombre}</Tooltip>
          </Polygon>
        ))}

        {/* Dibujar puntos de referencia */}
        {puntos.length > 0 && (
          <MarkerClusterGroup>
            {puntos.map((punto) => (
              <Marker
                key={punto.id}
                position={[punto.geom.coordinates[1], punto.geom.coordinates[0]]} // Leaflet usa [lat, lng]
              >
                <Tooltip>
                  <strong>{punto.nombre}</strong> <br />
                  {punto.domicilio} <br />
                  {punto.des_munici}, {punto.des_coloni}
                </Tooltip>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      {/* Botón para cargar más puntos */}
      {hasMore && (
        <button onClick={() => setPage((prev) => prev + 1)} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          Cargar más puntos
        </button>
      )}
    </div>
  );
};

export default MapaHidalgo;

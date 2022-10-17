import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.6239659);
  const [lat, setLat] = useState(28.0645427);
  const [zoom, setZoom] = useState(14);
  const [inFloridaTech, setInFloridaTech] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  // Gather location
  const getLocation = () => {
    // If we can't use navigator location getter
    if (!navigator.geolocation) {
        setStatus('Geolocation is not supported by your browser');
    } else { // Locating until we get the latitude and longitude
        setStatus('Locating...');
        navigator.geolocation.getCurrentPosition((position) => {
            setStatus(null);
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
            
            // Add Position Checking
            if((position.coords.latitude > 28.04 && position.coords.latitude < 28.08) && (position.coords.longitude > -80.8 && position.coords.longitude < -80.4)) {
                setInFloridaTech("True!");
            } else {
                setInFloridaTech("False!");
            }

        }, () => { // If this doesn't work, we callback to setting location to unable
            setStatus('Unable to retrieve your location');
        });
    }
}

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Florida Tech: {inFloridaTech}
      </div>
      <div ref={mapContainer} className="map-container" />
      <div classname="Get coords">
        <h1>Get Coordinates by Clicking Below</h1>
        <button onClick={getLocation}>Get Location</button>
        {status && <p>{status}</p>}
		{lat && <p>Latitude: {lat}</p>}
		{lng && <p>Longitude: {lng}</p>}
      </div>
    </div>
  );
}

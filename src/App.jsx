import React, { useRef, useEffect, useState } from 'react';
import { Chrono } from 'react-chrono';
import { load } from 'js-yaml';
import facts from './history.yaml';
import poiwaypoints from './poi_waypoints.json';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'


mapboxgl.accessToken = 'pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q';

export default function App() {
   // Map Vars
   const mapContainer = useRef(null);
   const map = useRef(null);
   const [lng, setLng] = useState(-80.6239659);
   const [lat, setLat] = useState(28.0645427);
   const [zoom, setZoom] = useState(14);
   const [inFloridaTech, setInFloridaTech] = useState("True!");

   // HISTORY TIMELINE Vars
   var history, val, item, items = [];
   const [app_history,setData]=useState([]);
   
   // HISTORY TIMELINE Vars
   // Get all data from the YAML
   const getData = () => {
      fetch(facts).then(f => f.text()).then(text =>
         {
            history = load(text);
            setData(history)
            console.log(history);
            return history
         });
   };
   
   // Load in timeline data
   useEffect(
      getData, // <- function that will run on every dependency update
      []       // <-- empty dependency array
   ); 

   // Parse each element
   for (val in app_history) {
      // DEBUGGING
      //console.log("val=",val)//console.log(app_history[val])//console.log("val=",app_history[val])
      
      // Loop through
      for (item in app_history[val]) {
         //console.log("Item = ",app_history[val][item].description.split('-'));
         items.push({
            title: app_history[val][item].year,
            cardTitle: app_history[val][item].Event,
            cardSubtitle: app_history[val][item].description.split('-')[1],
            cardDetailedText: app_history[val][item].description.split('-').slice(2, -1),
         });
      }
   }
   //console.log(items);

   // Set function and parameters for Geolocate
   const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
         enableHighAccuracy: true
      },
      trackUserLocation: true
   });

   // Set function for directions
   // API lives here: https://github.com/mapbox/mapbox-gl-directions/blob/master/API.md
   var directions = new Directions({
      accessToken: 'pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q',
      unit: 'imperial',
      profile: 'mapbox/walking',
      interactive: true // switch to false for no clicking
   });

   // Directional routing?
   /*
   map.on('load', function() {
      directions.setOrigin([-117.1425, 32.63638889]);
      directions.addWaypoint(0, [-117.1425, 32.63638889]);
      directions.addWaypoint(1, [-117.195, 32.75416667]);
      directions.addWaypoint(2, [-116.5616667, 32.93583333]);
      directions.setDestination([-116.5616667, 32.93583333]);
   });
   */



   // Initialize map
   useEffect(() => {
      if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
         container: mapContainer.current,
         style: 'mapbox://styles/mapbox/streets-v11',
         center: [lng, lat],
         zoom: zoom
      });
      map.current.addControl(geolocate); // Add Geolocate button
      map.current.addControl(directions, 'top-left'); // Add directions

      // Add Location Waypoints Layer

      map.current.on("load", function () {
         // Add an image to use as a custom marker
         map.current.loadImage(
         "https://cdn4.iconfinder.com/data/icons/geo-points-1/154/star-geo-point-location-gps-place-512.png",
         function (error, image) {
            if (error) throw error;
            map.current.addImage("custom-marker", image);
            // Add a GeoJSON source with multiple points
            map.current.addSource("points", {
               type: "geojson",
               data: {
               type: "FeatureCollection",
               features: poiwaypoints.locations,
               },
            });
            // Add a symbol layer
            map.current.addLayer({
               id: "points",
               type: "symbol",
               source: "points",
               layout: {
               "icon-image": "custom-marker",
               "icon-size": 0.08,
               // get the title name from the source's "title" property
               "text-field": ["get", "title"],
               "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
               "text-offset": [0, 1.25],
               "text-anchor": "top",
               },
            });
         });
      });
   
   });

   
    

   // Update users current lat and lng
   useEffect(() => {
      if (!map.current) return; // wait for map to initialize
      map.current.on('move', () => {
         setLng(map.current.getCenter().lng.toFixed(6));
         setLat(map.current.getCenter().lat.toFixed(6));
         setZoom(map.current.getZoom().toFixed(2));

         if ((lat > 28.057913 && lat < 28.06969) && (lng > -80.625 && lng < -80.620)) {
            setInFloridaTech("True!");
         } else {
            setInFloridaTech("False!");
         }

      });
   });

   return (
      <div>
         <div className="map-sidebar">
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Florida Tech: {inFloridaTech}
         </div>
         <div ref={mapContainer} className="map-container"></div>

         <div className='timeline'>
            <Chrono items={items} allowDynamicUpdate={true} mode='HORIZONTAL'/>
         </div>

         <div align="center" className="latlong_display">
            {lat && <p>Latitude: {lat}</p>}
            {lng && <p>Longitude: {lng}</p>}
         </div>
      </div>
   );
}

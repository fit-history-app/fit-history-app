import React, { useRef, useEffect, useState } from 'react';
import { Chrono } from 'react-chrono';
import { load } from 'js-yaml';
import facts from './history.yaml';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q';

export default function App() {
   const mapContainer = useRef(null);
   const map = useRef(null);
   const [lng, setLng] = useState(-80.6239659);
   const [lat, setLat] = useState(28.0645427);
   const [zoom, setZoom] = useState(14);
   const [inFloridaTech, setInFloridaTech] = useState(null);

   // HISTORY TIMELINE UI
   var history, val, item, items = [];
   const [app_history,setData]=useState([]);
   
   // Make method
   const getData = () => {
      fetch(facts).then(f => f.text()).then(text =>
         {
            history = load(text);
            setData(history)
            //console.log(history);
            return history
         });
   };
   
   // Slower but only happens on first load
   window.onload = getData()

   // Get Data On Load (Much Faster But Everytime Map Is Touched, Reload)
   /*
   useEffect(()=>{
      getData()
    },[]);
   */

   //console.log(app_history)
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
   console.log(items);

   // Set function and parameters for Geolocate
   const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
         enableHighAccuracy: true
      },
      trackUserLocation: true
   });

   useEffect(() => {
      if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
         container: mapContainer.current,
         style: 'mapbox://styles/mapbox/streets-v11',
         center: [lng, lat],
         zoom: zoom
      });
      map.current.addControl(geolocate); // Add Geolocate button
   });

   useEffect(() => {
      if (!map.current) return; // wait for map to initialize
      map.current.on('move', () => {
         setLng(map.current.getCenter().lng.toFixed(8));
         setLat(map.current.getCenter().lat.toFixed(8));
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

import React, { useRef, useEffect, useState } from 'react';
import { Chrono } from 'react-chrono';
import { load } from 'js-yaml';
import facts from './history.yaml';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// Import this to get geolocate controls??????
import { GeolocateControl } from 'react-map-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q';

export default function App() {
   const mapContainer = useRef(null);
   const map = useRef(null);
   const [lng, setLng] = useState(-80.6239659);
   const [lat, setLat] = useState(28.0645427);
   const [zoom, setZoom] = useState(14);
   const [inFloridaTech, setInFloridaTech] = useState(null);
   const [status, setStatus] = useState(null);
   
   // HISTORY TIMELINE UI
   var history, val, item, items = [];
   const [app_history,setData]=useState([]);
   
   // Make method
   const getData=()=>{
      fetch(facts).then(f => f.text()).then(text =>
         {
            history = load(text);
            setData(history)
            //console.log(history);
            return history
         });
   };
   // Get Data On Load
   useEffect(()=>{
      getData()
    },[]);
   
    //console.log(app_history)
   for (val in app_history) {
      // DEBUGGING
      //console.log("val=",val)
      //console.log(app_history[val])
      //console.log("val=",app_history[val])
      
      // Loop through
      for (item in app_history[val]) {
         //console.log("Item = ",app_history[val][item].description.split('-'));
         items.push({
            title: app_history[val][item].year,
            cardTitle: app_history[val][item].Event,
            cardSubtitle: app_history[val][item].description.split('-')[1],
            cardDetailedText: app_history[val][item].description.split('-').slice(2, -1),
         });
         //console.log(items)
      }
   }
   console.log(items);

   // Backup if data can't be read
   if (items == null) {
      items = [
         {
            title: "1950",
            cardTitle: "First Rocket Launch",
            cardSubtitle: "The first rocket launch from Cape Canaveral occurred on July 24, 1950.",
            cardDetailedText: "Bumper 8 was a modified German V-2 with a WAC Corporal as its second stage.",
         },
         {
            title: "1958",
            cardTitle: "The Founding of Brevard Engineering College",
            cardSubtitle: "On July 6, 1958, Jerry Keuper and Harold Dibble organized an engineer’s cotillion at the Trade Winds Hotel to rally support for the proposed College.",
            cardDetailedText: ["The Engineer’s Cotillion provided money to pay for newspaper ads and class schedules.", 
            "In 1958, 148 male students and 6 female students signed up for BEC’s first Fall term, the average age was 33.",
            "The University of Melbourne allowed BEC to use its building on Country Club Road as its college office.",
            "Classes were Scheduled from 7 to 10 on Monday, Wednesday, and Friday Evenings in three rented class rooms at Eau Gallie Junior High School.",
            "Tuition was $35 for one course, $68 for two courses, and $98 for three courses."],
         },
         {
            title: "1959",
            cardTitle: "BEC’s First Relocation",
            cardSubtitle: "In 1959, BEC had to relocate its classes to the First Methodist Church at Waverly place.",
            cardDetailedText: "This was due to the presence of African-American students, the Junior High would not allow BEC to host classes there anymore.",
         },
         {
            title: "1960",
            cardTitle: "BEC’s Second Relocation",
            cardSubtitle: "In 1960, BEC moved to its third home at Radiations Inc. ‘s Building NO. 1, adjacent to Melbourne’s airport.",
            cardDetailedText: ["Radiation Inc. now known as Harris Corporation (Now in 2022, known as L3Harris), founded by Homer Denius and George Shaw.",
            "Shaw was a BEC trustee, and Denius was committed to the University, promising to donate 1,000 shares of Radiation stock to the school if it could not find a permanent home in Melbourne."],
         },
         {
            title: "1961",
            cardTitle: "BEC’s First Building",
            cardSubtitle: "In April 1961, Homer Denius, president of Radiation Inc., donated 1,000 shares of Radiation stock to help finance the administration building and first classrooms.",
            cardDetailedText: ["The 9,285- sq ft construction cost $75,000.",
            "The Admin. Building (later named the John Miller Building) and the first classrooms were completed in May 1961."],
         }
      ]
   };

   

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
         setLng(map.current.getCenter().lng.toFixed(6));
         setLat(map.current.getCenter().lat.toFixed(6));
         setZoom(map.current.getZoom().toFixed(2));

         if ((lat > 28.04 && lat < 28.08) && (lng > -80.8 && lng < -80.4)) {
            setInFloridaTech("True!");
         } else {
            setInFloridaTech("False!");
         }

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
            if ((position.coords.latitude > 28.04 && position.coords.latitude < 28.08) && (position.coords.longitude > -80.8 && position.coords.longitude < -80.4)) {
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
         <div ref={mapContainer} className="map-container"></div>
         <div align="center" className="Get coords">
            <h1>Get Coordinates by Clicking Below</h1>
            <button onClick={getLocation}>Get Location</button>
            {status && <p>{status}</p>}
            {lat && <p>Latitude: {lat}</p>}
            {lng && <p>Longitude: {lng}</p>}
         </div>
         <div className='timeline'>
            <Chrono items={items} allowDynamicUpdate={true} mode='HORIZONTAL'/>
         </div>
      </div>
   );
}

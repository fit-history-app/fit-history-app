import React, { useRef, useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import { load } from "js-yaml";
import facts from "../data/history.yaml";
import poiwaypoints from "../data/poi_waypoints.json";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Directions from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q";

export default function Root() {
  // Map Vars
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.6239659);
  const [lat, setLat] = useState(28.0645427);
  const [zoom, setZoom] = useState(14);
  const [inFloridaTech, setInFloridaTech] = useState("True!");
  var directions_interactive = false;
  var location_on = false;
  const [tour, setTour] = useState(null);

  // HISTORY TIMELINE Vars
  var history,
    val,
    item,
    items = [];
  const [app_history, setData] = useState([]);

  // HISTORY TIMELINE Vars
  // Get all data from the YAML
  const getData = () => {
    fetch(facts)
      .then((f) => f.text())
      .then((text) => {
        history = load(text);
        setData(history);
      //   console.log(history);
        return history;
      });
  };

  
    if (!location_on) {
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
            cardSubtitle: app_history[val][item].description.split("-")[1],
            cardDetailedText: app_history[val][item].description
              .split("-")
              .slice(2, -1),
          });
        }
      }
    } else {
      const geoItems = [];
      for (var loc of poiwaypoints.locations) {
        const dist = Math.sqrt(
          Math.pow(Math.abs(lng - loc.geometry[0]), 2) +
            Math.pow(Math.abs(lat - loc.geometry[1]), 2)
        );
        if (dist <= 0.00022) {
          for (var event of loc.timeline) {
            if (geoItems.indexOf(event) === -1) {
              geoItems.push(event);
            }
          }
        }
      }

      items = geoItems.map((event) => {
        return {
          title: event.year,
          cardTitle: event.Event,
          cardSubtitle: event.description[0],
          cardDetailedText: event.description.slice(1, -1),
        };
      });
    }
  

  // Load in timeline data
  useEffect(
    getData, // <- function that will run on every dependency update
    [] // <-- empty dependency array
  );

  //console.log(items);

  // Set function and parameters for Geolocate
  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  });

  geolocate.on("trackuserlocationstart", () => {
   location_on = true;
  });

  geolocate.on("trackuserlocationend", () => {
   location_on = false;
  });

  // Set function for directions
  // API lives here: https://github.com/mapbox/mapbox-gl-directions/blob/master/API.md
  var directions = new Directions({
    accessToken:
      "pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q",
    unit: "imperial",
    profile: "mapbox/walking",
    alternatives: false,
    controls: {
      inputs: false,
      profileSwitcher: false,
    },
    interactive: directions_interactive, // switch to false for no clicking
  });

  // Initialize map
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(geolocate); // Add Geolocate button
    map.current.addControl(directions, "top-left"); // Add directions

    // Add Location Waypoints Layer

    map.current.on("load", function () {
      // Add an image to use as a custom marker
      map.current.loadImage(
        "https://i0.wp.com/waypointagency.com/wp-content/uploads/2018/12/Waypoint-Site-Icon-Temp.png?fit=1187%2C1187&ssl=1",
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
              "icon-size": 0.04,
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });
  });


  // Update users current lat and lng
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(6));
      setLat(map.current.getCenter().lat.toFixed(6));
      setZoom(map.current.getZoom().toFixed(2));

      if (lat > 28.057913 && lat < 28.06969 && lng > -80.625 && lng < -80.62) {
        setInFloridaTech("True!");
      } else {
        //console.log(inFloridaTech)
        setInFloridaTech("False!");
      }
    });

    //TODO? Add a banner that allows for the user to know they left campus
  });

  function load_tour1() {
    // Remove 0th waypoint for each waypoint
    let direction_len = directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      directions.removeWaypoint(0);
    }

      // Set Tour Header
      setTour("Full Campus Tour")
      
      directions.setOrigin([lng, lat]);                                    // Start tour from current position
      directions.addWaypoint(0, [-80.6236784873690, 28.0664722507424]);    // Homer R. Denius Student Center
      directions.addWaypoint(1, [-80.6242591223761, 28.0673817308664]);    // Shaw Hall
      directions.addWaypoint(2, [-80.6231026353109, 28.0676384670891]);    // Rat
      directions.addWaypoint(3, [-80.62324, 28.06702]);                    // Middle of Botans Patch with Hut
      directions.addWaypoint(4, [-80.62295, 28.06574]);                    // Library
      directions.addWaypoint(5, [-80.6230357600855, 28.0645758007761]);    // Gleason
      directions.addWaypoint(6, [-80.62292, 28.06279]);                    // Panther Statue
      directions.addWaypoint(7, [-80.62430, 28.06280]);                    // Center of Olin Quad
      directions.setDestination([-80.6245510687411, 28.0644945875813]);    // Skurla
  }

  function load_tour2() {
    // Remove 0th waypoint for each waypoint
    let direction_len = directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      directions.removeWaypoint(0);
    }

      // Set Tour Header
      setTour("Housing Tour")

      directions.setOrigin([lng, lat]);                           // Start tour from current position
      directions.addWaypoint(0, [-80.62454555, 28.06934899]);     // Roberts
      directions.addWaypoint(1, [-80.62289, 28.06929]);           // CV Center
      directions.addWaypoint(2, [-80.62429396,	28.0678474]);     // Wood
      directions.addWaypoint(3, [-80.6242530,	28.06735212]);    // Shaw
      directions.addWaypoint(4, [-80.62521087,	28.0671871]);     // Brownlie
      directions.addWaypoint(5, [-80.62169, 28.06552]);           // Southgate
      directions.setDestination([-80.62253062,	28.05882285]);    // Farmer Hall
   }

  function load_tour3() {
    // Remove 0th waypoint for each waypoint
    let direction_len = directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      directions.removeWaypoint(0);
    }

      // Set Tour Header
      setTour("Places to Eat")

      directions.setOrigin([lng, lat]);                           // Start tour from current position   
      directions.addWaypoint(0, [-80.62264153,	28.0622793]);     // PDH
      directions.addWaypoint(1, [-80.62366024,	28.06647551]);    // SUB
      directions.setDestination([-80.62308355,	28.0676121]);     // RAT
   }

   function load_tour4() {
      // Remove 0th waypoint for each waypoint
      let direction_len = directions.getWaypoints().length
      for(let i = 0; i < direction_len; i++) {
         directions.removeWaypoint(0)
      }

      // Set Tour Header
      setTour("Academic Buildings")

      directions.setOrigin([lng, lat]);                           // Start tour from current position  

      directions.addWaypoint(0, [-80.62351488,	28.06603402]);    // Academic Quad
      directions.addWaypoint(1, [-80.62301697,	28.06571013]);    // Library
      directions.addWaypoint(2, [-80.62459202,	28.06441838]);    // Skurla
      directions.addWaypoint(3, [-80.62392939,	28.06440304]);    // Crawford
      directions.addWaypoint(4, [-80.6239268,	28.06322676]);    // OEC
      directions.addWaypoint(5, [-80.62432478,	28.06169464]);    // L3 in Olin Quad
      directions.setDestination([-80.62414047,	28.06073777]);    // HSDC
   }

  function remove_tour() {
    // Remove 0th waypoint for each waypoint
    let direction_len = directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      directions.removeWaypoint(0);
    }

    // Set Tour Header
    setTour(null);
  }

   // If tour == null, remove origin
   const tourRef = useRef(tour); // use this to fix inifite loop?
   useEffect(() => {
      if (tour == null) {
         directions.removeRoutes();
      }
    });
   
   function interactive_routing() {
      directions_interactive = !directions_interactive;

    directions.interactive(directions_interactive);

    // TODO: useEffect hook to make the mapobject reload the directions module
  }


   return (
      <div>
         <div className='header'>
            <h2><a href="/">FL Tech History Tours</a></h2>
            <div>
               <ul className='menuBar'>
                  <li>
                     <div className='itemContainer' id='tour'>
                        <button className='menuItem'>Tours</button>
                        <div className='subMenuItem'>
                           <p onClick={load_tour1}>Full Campus Tour</p>
                           <p onClick={load_tour2}>Housing Tour</p>
                           <p onClick={load_tour3}>Places to Eat</p>
                           <p onClick={load_tour4}>Academic Buildings</p>
                           {/* <p onClick={interactive_routing}>Allow Interactive Directions</p> */}
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className='itemContainer' id='games'>
                        <button className='menuItem'>Games</button>
                        <div className='subMenuItem'>
                           <p>Scavenger Hunt</p>
                           <p><a href="/trivia">History Trivia</a></p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className='itemContainer' id='sharing'>
                        <button className='menuItem'>Social</button>
                        <div className='subMenuItem'>
                           <a href="https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fkid_directed_site%3D0%26u%3Dhttps%253A%252F%252Ffit-history-tours.live%252F%26display%3Dpopup%26ref%3Dplugin%26src%3Dshare_button&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_US&kid_directed_site=0">
                              <img src="facebook_svg_icon.svg" alt="Facebook" />
                           </a>
                           <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" className="twitter-share-button" data-show-count="false">
                              
                              <img src="twitter_svg_icon.svg" alt="Twitter" />
                              </a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
                        </div>
                     </div>
                  </li>
                  {/* Hide The Current Tour If None Selected */}
                  {tour && <h3 className='header'>Current Tour: {tour}</h3>}
                  {tour && <button className='tourExit' onClick={remove_tour}>X</button>}
               </ul>
            </div>
         </div>

      <div className="map-sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Florida Tech:{" "}
        {inFloridaTech}
      </div>
      <div ref={mapContainer} className="map-container"></div>

      <div className="timeline">
        <Chrono
          items={items}
          allowDynamicUpdate={true}
          showAllCardsHorizontal={true}
          activeItemIndex={items.length - 1}
          mode="HORIZONTAL"
        />
      </div>
    </div>
  );
}

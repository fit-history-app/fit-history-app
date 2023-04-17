import React, { useRef, useEffect, useState, useContext } from "react";
import { Chrono } from "react-chrono";
import { load } from "js-yaml";
import facts from "../data/history.yaml";
import poiwaypoints from "../data/poi_waypoints.json";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Directions from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import { MapProvider, mapContext } from "./context/mapContext";
import Map from "./components/Map";

export default function Root() {

  const [map, setMap] = useContext(mapContext);

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
        console.log(history);
        return history;
      });
  };

  // Load in timeline data
  useEffect(
    getData, // <- function that will run on every dependency update
    [] // <-- empty dependency array
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
        cardSubtitle: app_history[val][item].description.split("-")[1],
        cardDetailedText: app_history[val][item].description
          .split("-")
          .slice(2, -1),
      });
    }
  }
  //console.log(items);

  function load_tour1() {
    // Remove 0th waypoint for each waypoint
    let direction_len = map.directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      map.directions.removeWaypoint(0);
    }

    // Set Tour Header
    map.setTour("Tour #1");

    map.directions.setOrigin([-80.62378, 28.06574]); // Middle of Academic Quad
    map.directions.addWaypoint(0, [-80.623678487369, 28.0664722507424]); // Homer R. Denius Student Center
    map.directions.addWaypoint(1, [-80.6242591223761, 28.0673817308664]); // Shaw Hall
    map.directions.addWaypoint(2, [-80.6231026353109, 28.0676384670891]); // Rat
    map.directions.addWaypoint(3, [-80.62324, 28.06702]); // Middle of Botans Patch with Hut
    map.directions.addWaypoint(4, [-80.62295, 28.06574]); // Library
    map.directions.addWaypoint(5, [-80.6230357600855, 28.0645758007761]); // Gleason
    map.directions.addWaypoint(6, [-80.62292, 28.06279]); // Panther Statue
    map.directions.addWaypoint(7, [-80.6243, 28.0628]); // Center of Olin Quad
    map.directions.setDestination([-80.6245510687411, 28.0644945875813]); // Skurla
  }

  function load_tour2() {
    // Remove 0th waypoint for each waypoint
    let direction_len = map.directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      map.directions.removeWaypoint(0);
    }

    // Set Tour Header
    map.setTour("Tour #2");

    map.directions.setOrigin([-80.62378, 28.06574]); // Middle of Academic Quad
    map.directions.addWaypoint(0, [-80.623678487369, 28.0664722507424]); // Homer R. Denius Student Center
    map.directions.addWaypoint(1, [-80.6242591223761, 28.0673817308664]); // Shaw Hall
    map.directions.addWaypoint(2, [-80.6231026353109, 28.0676384670891]); // Rat
    map.directions.setDestination([-80.6245510687411, 28.0644945875813]); // Skurla
  }

  function load_tour3() {
    // Remove 0th waypoint for each waypoint
    let direction_len = map.directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      map.directions.removeWaypoint(0);
    }

    // Set Tour Header
    map.setTour("Tour #3");

    map.directions.setOrigin([-80.62292, 28.06279]);
    map.directions.setDestination([-80.6243, 28.0628]);
  }

  function remove_tour() {
    // Remove 0th waypoint for each waypoint
    let direction_len = map.directions.getWaypoints().length;
    for (let i = 0; i < direction_len; i++) {
      map.directions.removeWaypoint(0);
    }

    // Set Tour Header
    map.setTour(null);
  }


  function interactive_routing() {
    map.directions_interactive = !map.directions_interactive;

    // TODO: useEffect hook to make the mapobject reload the directions module
  }

  // Update users current lat and lng
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      map.setLng(map.current.getCenter().map.lng.toFixed(6));
      map.setLat(map.current.getCenter().map.lat.toFixed(6));
      map.setZoom(map.current.getZoom().toFixed(2));

      if (
        map.lat > 28.057913 &&
        map.lat < 28.06969 &&
        map.lng > -80.625 &&
        map.lng < -80.62
      ) {
        map.setInFloridaTech("True!");
      } else {
        map.setInFloridaTech("False!");
      }
    });

    //TODO? Add a banner that allows for the user to know they left campus
  });

  return (
    <div>
      <div className="header">
        <h2>FL Tech History Tours</h2>
        <div>
          <ul className="menuBar">
            <li>
              <div className="itemContainer" id="tour">
                <button className="menuItem">Tours</button>
                <div className="subMenuItem">
                  <p onClick={load_tour1}>Load Tour #1</p>
                  <p onClick={load_tour2}>Load Tour #2</p>
                  <p onClick={load_tour3}>Load Tour #3</p>
                  <p onClick={interactive_routing}>
                    Allow Interactive Directions
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="itemContainer" id="games">
                <button className="menuItem">Games</button>
                <div className="subMenuItem">
                  <p>
                    <a href="/scav">Scavenger Hunt</a>
                  </p>
                  <p>
                    <a href="/trivia">History Trivia</a>
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="itemContainer" id="sharing">
                <button className="menuItem">Social</button>
                <div className="subMenuItem">
                  <a href="https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fkid_directed_site%3D0%26u%3Dhttps%253A%252F%252Ffit-history-tours.live%252F%26display%3Dpopup%26ref%3Dplugin%26src%3Dshare_button&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_US&kid_directed_site=0">
                    <img src="facebook_svg_icon.svg" alt="Facebook" />
                  </a>
                  <a
                    href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                    class="twitter-share-button"
                    data-show-count="false"
                  >
                    <img src="twitter_svg_icon.svg" alt="Twitter" />
                  </a>
                  <script
                    async
                    src="https://platform.twitter.com/widgets.js"
                    charset="utf-8"
                  ></script>
                </div>
              </div>
            </li>
            <h3 className="header">Current Tour: {map.tour}</h3>
            <button className="tourExit" onClick={remove_tour}>
              X
            </button>
          </ul>
        </div>
      </div>

      <div className="map-sidebar">
        Longitude: {map.lng} | Latitude: {map.lat} | Zoom: {map.zoom} | Florida Tech:{" "}
        {map.inFloridaTech}
      </div>

      <MapProvider>
        <Map />
      </MapProvider>

      <div className="timeline">
        <Chrono items={items} allowDynamicUpdate={true} mode="HORIZONTAL" />
      </div>

      <div align="center" className="latlong_display">
        {map.lat && <p>Latitude: {map.lat}</p>}
        {map.lng && <p>Longitude: {map.lng}</p>}
      </div>
    </div>
  );
}

import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Directions from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import poiwaypoints from "../../data/poi_waypoints.json"
import { mapContext } from "../context/mapContext";

// Map Vars
const mapContainer = useRef(null);
const map = useRef(null);
const [lng, setLng] = useState(-80.6239659);
const [lat, setLat] = useState(28.0645427);
const [zoom, setZoom] = useState(14);
const [inFloridaTech, setInFloridaTech] = useState("True!");
var directions_interactive = false;
const [tour, setTour] = useState(null);


// ____ ____ ____
// | __ |___ |  |
// |__] |___ |__|

// Set function and parameters for Geolocate
const geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
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

useEffect(() => {
  mapboxgl.accessToken =
  "pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q";

  const initMap = ({ setMap, mapContainer }) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(geolocate);
    map.current.addControl(directions, "top-left");
  }

  map.current.on("load", function () {
    map.current.loadImage(
      "https://cdn4.iconfinder.com/data/icons/geo-points-1/154/star-geo-point-location-gps-place-512.png",
      function (error, image) {
        if (error) throw error;
        map.current.addImage("custom-marker", image);

        //add geoJSON with points
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
      }
    );
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
        setInFloridaTech("False!");
      }
    });

    //TODO? Add a banner that allows for the user to know they left campus
  });

})








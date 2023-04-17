import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Directions from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

import poiwaypoints from "../../data/poi_waypoints.json";
import { mapContext } from "../context/mapContext";
import Popup from "./Popup";

import styled from "styled-components";

// ∩◉_◉)⊃━━☆ﾟ.*ᵏᵃᵒᵐᵒʲᶦ･｡ﾟ

const Map = () => {
  const [content, setContent] = useState([]);
  const [popupLngLat, setPopupLngLat] = useState(null);
  const { setMap, map } = useContext(mapContext);
  const mapContainer = useRef(null);

  // popup close
  // function onPopupClose() {
  //   setContent([]);
  //   setPopupLngLat(null);
  // }


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
    interactive: map.directions_interactive, // switch to false for no clicking
  });

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q";

    const initMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [map.lng, map.lat],
        zoom: map.zoom,
      });
      map.current.addControl(geolocate);
      map.current.addControl(directions, "top-left");
    };

    map.on("load", () => {
      setMap(map);

      map.resize()
    });

    map.on("load", () => {

    })

    map.current.on("load", () => {
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
  });
};

export default Map;
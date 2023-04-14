import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import poiwaypoints from "../../data/poi_waypoints.json";
import Directions from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import {mapContainer} from "../root";

mapboxgl.accessToken = "pk.eyJ1IjoidGVlbWFuMjIiLCJhIjoiY2w5ZDcxbWh0MDM4MTN3dDl3Nnk1bmh2MyJ9.kfti7m0R9PtYzfP-c7qK2Q";


export default function Scav() {
  // map
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-80.6239659);
  const [lat, setLat] = useState(28.0645427);
  const [zoom, setZoom] = useState(14);

  // geolocation services
  const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  });

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
    interactive: false, // switch to false for no clicking
  });

  //  _  _ ____ ___
  //  |\/| |--| |--'

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
        }
      );
    });

    map.current.on("load", function () {});
  });

  // Update users current lat and lng
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(6));
      setLat(map.current.getCenter().lat.toFixed(6));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div className="header">
        <h2>FL Tech History Tours</h2>
        <div>
          <ul className="menuBar">
            <li>
              <div className="itemContainer" id="games">
                <button className="menuItem">Games</button>
                <div className="subMenuItem">
                  <p>Scavenger Hunt</p>
                  <p>
                    <a class="no-hyperlink" href="/trivia">
                      History Trivia
                    </a>
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
          </ul>
        </div>
      </div>
    </div>
  );
}

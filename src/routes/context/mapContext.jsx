import React, { createContext, useState } from "react";

const mapContext = createContext(undefined);

function MapProvider({ children }) {
  const [popupContent, setPopupContent] = useState([]);
  const [count, setCount] = useState(0);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(-80.6239659);
  const [lat, setLat] = useState(28.0645427);
  const [inFloridaTech, setInFloridaTech] = useState("True!");
  var directions_interactive = false;
  const [tour, setTour] = useState(null);
  const [zoom, setZoom] = useState(14);
  const [directions, setDirections] = useState(null);

  const Provider = mapContext.Provider;

  return (
    <Provider
      value={{
        popupContent,
        setPopupContent,
        map,
        setMap,
        lng,
        setLng,
        lat,
        setLat,
        inFloridaTech,
        setInFloridaTech,
        directions_interactive,
        tour,
        setTour,
        count,
        setCount,
        zoom,
        setZoom,
      }}
    >
      {children}
    </Provider>
  );
}

export { MapProvider, mapContext };
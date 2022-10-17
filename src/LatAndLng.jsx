import React, { useState } from 'react';

const LatAndLng = () => {
    // Declare vars 
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [inFloridaTech, setInFloridaTech] = useState(null);
    const [status, setStatus] = useState(null);

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
		<div className="LatAndLng">
            <h1>Get Coordinates by Clicking Below</h1>
			<button onClick={getLocation}>Get Location</button>
			<h1>Your Coordinates</h1>
            {/*<p>{status}</p> // this won't go away after it loads. by putting the null && status it will go away after*/}
            {status && <p>{status}</p>}
			{lat && <p>Latitude: {lat}</p>}
			{lng && <p>Longitude: {lng}</p>}
            <h1>Inside Florida Tech?</h1>
            {inFloridaTech && <p>In Florida Tech: {inFloridaTech}</p>}
		</div>
	);
}

export default LatAndLng;
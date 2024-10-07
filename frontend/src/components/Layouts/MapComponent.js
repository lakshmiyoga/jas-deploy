import React, { useState, useEffect } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Make sure to import the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ setPosition ,dummyLat ,dummyLng  }) => {
    const [markerPosition, setMarkerPosition] = useState([dummyLat, dummyLng]);

    // Example of handling map events to set position
    useMapEvents({
        click(e) {
            setPosition(e.latlng.lat, e.latlng.lng);
            setMarkerPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    useEffect(() => {
        // Set initial position of marker
        setPosition(markerPosition[0], markerPosition[1]);
    }, [markerPosition]);

    return (
        <Marker position={markerPosition} draggable={true} eventHandlers={{
            dragend(e) {
                const marker = e.target;
                const position = marker.getLatLng();
                setMarkerPosition([position.lat, position.lng]);
                setPosition(position.lat, position.lng);
            },
        }} />
    );
};

export default MapComponent;

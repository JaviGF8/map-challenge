import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const defaultMapOptions = {
  center: { lat: 48.86993, lng: 2.334504 },
  mapTypeId: 'roadmap',
  navigationControl: false,
  mapTypeControl: false,
  scaleControl: true,
  draggable: true,
  disableDefaultUI: true,
  language: 'en',
};

let mapDiv = null;

const initializeMapsApi = (callback) => {
  if (!window.google) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`;
    script.id = 'googleMaps';
    document.body.appendChild(script);
    return script.addEventListener('load', callback);
  }
  return callback();
};

const centerMap = (position) => mapDiv.panTo(position);

const makeMarkerBounce = (mapMarker) => {
  mapMarker.setAnimation(window.google.maps.Animation.BOUNCE);
  setTimeout(() => {
    mapMarker.setAnimation(null);
  }, 250);
};

/**
 * Creates a marker for the map
 */
const createMarker = (marker, bounceOnHover, onMarkerHover) => {
  if (marker && marker.geoposition && mapDiv) {
    const { icon, geoposition, name } = marker;

    const newIcon = {
      scaledSize: new window.google.maps.Size(50, 50), // scaled size
    };
    if (icon) {
      newIcon.url = icon;
    }

    const mapMarker = new window.google.maps.Marker({
      map: mapDiv,
      icon: newIcon,
      title: name || 'point',
      position: { lat: geoposition.lat, lng: geoposition.lng },
    });

    if (bounceOnHover) {
      mapMarker.addListener('mouseover', () => {
        makeMarkerBounce(mapMarker);
        onMarkerHover(name);
      });
    }

    return mapMarker;
  }
  return null;
};

/**
 * Creates an array of markers
 */
const createMarkers = (markers, bounceOnHover, onMarkerHover) => {
  let mrkrs = [];
  if (markers && markers.length) {
    mrkrs = markers.map((marker) => ({ id: marker.name, marker: createMarker(marker, bounceOnHover, onMarkerHover) }));
  }

  return mrkrs;
};

const GoogleMap = ({ bounceOnHover, className, mapId, markers, onMarkerHover, selectedMarker, zoom }) => {
  const [ initialized, setInitialized ] = useState(false);
  const [ stateMarkers, setStateMarkers ] = useState([]);

  const createMap = () => {
    const mapOptions = { ...defaultMapOptions, zoom };

    mapDiv = new window.google.maps.Map(document.getElementById('map'), mapOptions);
    setStateMarkers(createMarkers(markers, bounceOnHover, onMarkerHover));
  };

  useEffect(() => {
    if (!initialized) {
      initializeMapsApi(() => {
        setInitialized(true);
        createMap();
      });
    }
  });

  useEffect(() => {
    if (selectedMarker) {
      // Has a new marker, add animation
      const currMarker = stateMarkers.find((mrkr) => mrkr.id === selectedMarker.name);

      if (currMarker) {
        makeMarkerBounce(currMarker.marker);
        centerMap(currMarker.marker.position);
      }
    }
  }, [ selectedMarker ]);

  useEffect(() => {
    // Has a different markers
    if ((stateMarkers && markers && stateMarkers.length < markers.length) || (!stateMarkers && markers)) {
      // New markers have more than previous
      createMarkers(markers, bounceOnHover, onMarkerHover);
    } else if ((!markers && stateMarkers) || (markers && stateMarkers.length > markers.length)) {
      createMap();
    }
  }, [ markers ]);

  return <div id={mapId} className={`custom-map${className ? ` ${className}` : ''}`} />;
};

GoogleMap.defaultProps = {
  bounceOnHover: true,
  className: null,
  mapId: 'map',
  markers: [],
  onMarkerHover: () => true,
  selectedMarker: null,
  zoom: 15,
};

GoogleMap.propTypes = {
  bounceOnHover: PropTypes.bool,
  className: PropTypes.string,
  mapId: PropTypes.string,
  // Markers is an array of objects like: { icon, geoposition: { lat, lng }, name }
  markers: PropTypes.array,
  onMarkerHover: PropTypes.func,
  selectedMarker: PropTypes.string,
  zoom: PropTypes.number,
};

export default GoogleMap;

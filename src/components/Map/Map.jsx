import React, { Component } from 'react';
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

const centerMap = (position) => mapDiv.panTo(position);

const makeMarkerBounce = (mapMarker) => {
  mapMarker.setAnimation(window.google.maps.Animation.BOUNCE);
  setTimeout(() => {
    mapMarker.setAnimation(null);
  }, 250);
};

export default class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateMarkers: [],
    };
  }

  componentDidMount() {
    if (!window.google) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`;
      script.id = 'googleMaps';
      document.body.appendChild(script);
      script.addEventListener('load', () => {
        this.createMap();
      });
    } else {
      this.createMap();
    }
  }

  componentDidUpdate(prevProps) {
    const { markers, selectedMarker } = this.props;
    const { stateMarkers } = this.state;

    if (stateMarkers && stateMarkers.length && selectedMarker !== prevProps.selectedMarker) {
      // If has a new marker, add animation
      if (selectedMarker !== prevProps.selectedMarker) {
        const currMarker = stateMarkers.find((mrkr) => mrkr.id === selectedMarker.name);

        if (currMarker) {
          makeMarkerBounce(currMarker.marker);
          centerMap(currMarker.marker.position);
        }
      }
    }
    if (
      (prevProps.markers && markers && prevProps.markers.length < markers.length) ||
      (!prevProps.markers && markers)
    ) {
      // New markers have more than previous
      this.createMarkers();
    } else if ((!markers && prevProps.markers) || (markers && prevProps.markers.length > markers.length)) {
      this.createMap();
    }
  }

  createMarker = (marker) => {
    if (marker && marker.geoposition && mapDiv) {
      const { bounceOnHover, onMarkerHover } = this.props;
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
          if (onMarkerHover) {
            onMarkerHover(name);
          }
        });
      }

      return mapMarker;
    }
    return null;
  };

  clearStateMarkers = () => {
    const { stateMarkers } = this.state;

    if (stateMarkers && stateMarkers.length) {
      stateMarkers.forEach(({ marker }) => {
        marker.visible = false;
      });
    }
  };

  createMarkers = () => {
    const { markers } = this.props;

    this.clearStateMarkers();

    let stateMarkers = [];
    if (markers && markers.length) {
      stateMarkers = markers.map((marker) => ({ id: marker.name, marker: this.createMarker(marker) }));
    }

    this.setState({ stateMarkers });
  };

  createMap = () => {
    const { zoom } = this.props;
    const mapOptions = { ...defaultMapOptions, zoom };

    mapDiv = new window.google.maps.Map(document.getElementById('map'), mapOptions);
    this.createMarkers();
  };

  render() {
    const { mapId, className } = this.props;

    return <div id={mapId} className={`custom-map${className ? ` ${className}` : ''}`} />;
  }
}

GoogleMap.defaultProps = {
  bounceOnHover: true,
  className: null,
  mapId: 'map',
  selectedMarker: null,
  markers: [],
  onMarkerHover: null,
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

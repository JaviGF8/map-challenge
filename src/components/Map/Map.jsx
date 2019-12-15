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
    const { address, zoom } = this.props;

    this.getLatitudeLongitude({ ...defaultMapOptions, zoom }, address);
  }

  componentDidUpdate(prevProps) {
    const { address, markers, selectedMarker, zoom } = this.props;
    const { stateMarkers } = this.state;

    if (address && prevProps.address !== address) {
      this.getLatitudeLongitude({ ...defaultMapOptions, zoom }, address);
    }

    if (stateMarkers && stateMarkers.length && selectedMarker !== prevProps.selectedMarker) {
      // If it had a previous marker, remove animation
      if (prevProps.selectedMarker) {
        const prevMarker = stateMarkers.find((mrkr) => mrkr.id === prevProps.selectedMarker);
        prevMarker.marker.setAnimation(null);
      }
      // If has a new marker, add animation
      if (selectedMarker) {
        const currMarker = stateMarkers.find((mrkr) => mrkr.id === selectedMarker);
        makeMarkerBounce(currMarker.marker);
        centerMap(currMarker.marker.position);
      }
    }
    if ((!stateMarkers || !stateMarkers.length) && markers && markers.length) {
      this.createMap(defaultMapOptions);
    }
  }

  getLatitudeLongitude = (mapOptions, address = '') => {
    const { zoom } = this.props;
    // Initialize the Geocoder
    const geocoder = new window.google.maps.Geocoder();
    if (geocoder) {
      geocoder.geocode({ address }, (results, status) => {
        if ('OK' === status && 1 <= results.length) {
          mapOptions.center.lat = results[0].geometry.location.lat();
          mapOptions.center.lng = results[0].geometry.location.lng();
          mapOptions.zoom = zoom;
        }
        this.createMap(mapOptions);
      });
    }
  };

  createMarker = (marker) => {
    if (marker && marker.geoposition && mapDiv) {
      const { bounceOnHover, iconAvailable, iconUnavailable, onMarkerHover } = this.props;
      const { _id, availability, geoposition, name } = marker;

      const icon = {
        scaledSize: new window.google.maps.Size(50, 50), // scaled size
      };
      if (iconAvailable || iconUnavailable) {
        icon.url = availability ? iconAvailable : iconUnavailable;
      }

      const mapMarker = new window.google.maps.Marker({
        map: mapDiv,
        icon,
        title: name || 'point',
        position: { lat: geoposition.lat, lng: geoposition.lng },
      });

      if (bounceOnHover) {
        mapMarker.addListener('mouseover', () => {
          makeMarkerBounce(mapMarker);
          if (onMarkerHover) {
            onMarkerHover(_id);
          }
        });
      }

      return mapMarker;
    }
    return null;
  };

  createMap = (mapOptions) => {
    const { createCenterMarker, markers } = this.props;

    mapDiv = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    let stateMarkers = [];
    if (markers && markers.length) {
      stateMarkers = markers.map((marker) => ({ id: marker._id, marker: this.createMarker(marker) }));
    } else if (createCenterMarker) {
      stateMarkers.push(this.createMarker({ geoposition: { lat: mapOptions.center.lat, lng: mapOptions.center.lng } }));
    }

    this.setState({ stateMarkers });
  };

  render() {
    const { mapId, minWidth, minHeight } = this.props;
    const style = { minWidth, minHeight };

    return <div id={mapId} style={style} />;
  }
}

GoogleMap.defaultProps = {
  address: null,
  bounceOnHover: true,
  createCenterMarker: false,
  iconAvailable: null,
  iconUnavailable: null,
  mapId: 'map',
  minHeight: '100vh ',
  minWidth: '100%',
  selectedMarker: null,
  markers: [],
  onMarkerHover: null,
  zoom: 16,
};

GoogleMap.propTypes = {
  address: PropTypes.string,
  bounceOnHover: PropTypes.bool,
  createCenterMarker: PropTypes.bool,
  iconAvailable: PropTypes.string,
  iconUnavailable: PropTypes.string,
  mapId: PropTypes.string,
  minHeight: PropTypes.string,
  minWidth: PropTypes.string,
  markers: PropTypes.array,
  // Array of objects like: { _id, availability: true/false, geoposition: { lat, lng }, name }
  onMarkerHover: PropTypes.func,
  selectedMarker: PropTypes.string,
  zoom: PropTypes.number,
};

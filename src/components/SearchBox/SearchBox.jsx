import React, { useState } from 'react';
import PropTypes from 'prop-types';

import dropOffMarker from '../../assets/dropOffMarker.svg';
import pickUpMarker from '../../assets/pickUpMarker.svg';

import './index.scss';
import Input from '../base/Input/Input';
import { ICON_TYPES, ICON_STATUS } from '../base/Icon/Icon';
import Button from '../base/Button/Button';

import { getGeocode, getJobs } from '../../actions/api';

const formatMarker = ({ address, latitude, longitude }, dropoff) => ({
  geoposition: { lat: latitude, lng: longitude },
  name: address,
  icon: dropoff ? dropOffMarker : pickUpMarker,
});

const SearchBox = ({ setMarkers }) => {
  const [ dropOffStatus, setDropOffStatus ] = useState(null);
  const [ pickUpStatus, setPickUpStatus ] = useState(null);
  const [ loadingDropOff, setLoadingDropOff ] = useState(false);
  const [ loadingPickUp, setLoadingPickUp ] = useState(false);
  const [ validDropOff, setValidDropOff ] = useState(false);
  const [ validPickUp, setValidPickUp ] = useState(false);
  const [ creating, setCreating ] = useState(false);

  return (
    <div className="search-box shadow">
      <Input
        onChange={(address) => {
          setLoadingPickUp(true);
          if (address && 2 < address.length) {
            getGeocode(address)
              .then((valid) => {
                // Valid address
                setLoadingPickUp(false);
                setValidPickUp(valid);
                if (setMarkers) {
                  setMarkers([ formatMarker(valid) ]);
                }
                setPickUpStatus(ICON_STATUS.PRESENT);
              })
              .catch(() => {
                // Wrong address
                setLoadingPickUp(false);
                setValidPickUp(null);
                setPickUpStatus(ICON_STATUS.ERROR);
              });
          }
        }}
        iconType={ICON_TYPES.PICK_UP}
        iconStatus={loadingPickUp ? ICON_STATUS.BLANK : pickUpStatus}
        placeholder="Pick up address"
      />
      <Input
        disabled={!validPickUp}
        iconType={ICON_TYPES.DROP_OFF}
        iconStatus={loadingDropOff ? ICON_STATUS.BLANK : dropOffStatus}
        onChange={(dropOff) => {
          setLoadingDropOff(true);
          if (dropOff && 2 < dropOff.length) {
            getJobs(validPickUp.address, dropOff)
              .then((valid) => {
                // Valid dropoff
                setDropOffStatus(ICON_STATUS.PRESENT);
                setValidDropOff(valid);
                if (setMarkers) {
                  setMarkers([ formatMarker(validPickUp), formatMarker(valid.dropoff, true) ]);
                }
                setLoadingDropOff(false);
              })
              .catch(() => {
                // Wrong dropoff
                setDropOffStatus(ICON_STATUS.ERROR);
                setValidDropOff(null);
                setLoadingDropOff(false);
              });
          }
        }}
        placeholder="Drop off address"
      />
      <Button
        disabled={creating || !validDropOff || !validPickUp || loadingDropOff || loadingPickUp}
        onClick={() => {
          setCreating(true);
          setTimeout(() => setCreating(false), 1000);
        }}
        text={creating ? 'Creating job...' : 'Create job'}
      />
    </div>
  );
};

SearchBox.defaultProps = {
  setMarkers: null,
};

SearchBox.propTypes = {
  setMarkers: PropTypes.func,
};

export default SearchBox;

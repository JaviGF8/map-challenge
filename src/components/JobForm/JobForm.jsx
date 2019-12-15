import React, { useState } from 'react';
import PropTypes from 'prop-types';

import dropOffMarker from '../../assets/dropOffMarker.svg';
import pickUpMarker from '../../assets/pickUpMarker.svg';

import Input from '../base/Input/Input';
import { ICON_TYPES, ICON_STATUS } from '../base/Icon/Icon';
import Button from '../base/Button/Button';

import { getGeocode, getJobs } from '../../actions/api';

const formatMarker = ({ address, latitude, longitude }, dropoff) => ({
  geoposition: { lat: latitude, lng: longitude },
  name: address,
  icon: dropoff ? dropOffMarker : pickUpMarker,
});

const getMarkersArray = (pickUp, dropOff) => {
  const res = [];

  if (pickUp) {
    res.push(pickUp);
  }
  if (dropOff) {
    res.push(dropOff);
  }

  return res;
};

const JobForm = ({ onCreate, setMarkers }) => {
  const [ dropOffStatus, setDropOffStatus ] = useState(null);
  const [ pickUpStatus, setPickUpStatus ] = useState(null);
  const [ loadingDropOff, setLoadingDropOff ] = useState(false);
  const [ loadingPickUp, setLoadingPickUp ] = useState(false);
  const [ validDropOff, setValidDropOff ] = useState(false);
  const [ validPickUp, setValidPickUp ] = useState(false);
  const [ creating, setCreating ] = useState(false);

  return (
    <form className="job-form shadow">
      <Input
        onChange={(address) => {
          setLoadingPickUp(true);
          if (address && 2 < address.length) {
            getGeocode(address)
              .then((valid) => {
                // Valid address
                const pickUpFormatted = formatMarker(valid);
                setLoadingPickUp(false);
                setValidPickUp(pickUpFormatted);
                if (setMarkers) {
                  setMarkers(getMarkersArray(pickUpFormatted, validDropOff));
                }
                setPickUpStatus(ICON_STATUS.PRESENT);
              })
              .catch(() => {
                // Wrong address
                if (setMarkers) {
                  setMarkers(getMarkersArray(null, validDropOff));
                }
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
            getJobs(validPickUp.name, dropOff)
              .then((valid) => {
                // Valid dropoff
                const dropoffFormatted = formatMarker(valid.dropoff, true);
                setDropOffStatus(ICON_STATUS.PRESENT);
                setValidDropOff(dropoffFormatted);
                if (setMarkers) {
                  setMarkers(getMarkersArray(validPickUp, dropoffFormatted));
                }
                setLoadingDropOff(false);
              })
              .catch(() => {
                // Wrong dropoff
                if (setMarkers) {
                  setMarkers(getMarkersArray(validPickUp, null));
                }
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
          getJobs(validPickUp.name, validDropOff.name)
            .then(() => {
              // Valid create, set timeout to simulate
              setTimeout(() => {
                setCreating(false);
                if (onCreate) {
                  onCreate();
                }
              }, 1000);
            })
            .catch(() => {
              // Wrong create, set timeout to simulate
              setTimeout(() => setCreating(false), 1000);
            });
        }}
        text={creating ? 'Creating job...' : 'Create job'}
      />
    </form>
  );
};

JobForm.defaultProps = {
  onCreate: null,
  setMarkers: null,
};

JobForm.propTypes = {
  onCreate: PropTypes.func,
  setMarkers: PropTypes.func,
};

export default JobForm;

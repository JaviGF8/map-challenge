import React, { useEffect, useState } from 'react';
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
  const [ dropOff, setDropOff ] = useState(null);
  const [ pickUp, setPickUp ] = useState(null);
  const [ dropOffStatus, setDropOffStatus ] = useState(null);
  const [ pickUpStatus, setPickUpStatus ] = useState(null);
  const [ loadingDropOff, setLoadingDropOff ] = useState(false);
  const [ loadingPickUp, setLoadingPickUp ] = useState(false);
  const [ validDropOff, setValidDropOff ] = useState(false);
  const [ validPickUp, setValidPickUp ] = useState(false);
  const [ creating, setCreating ] = useState(false);

  useEffect(() => {
    // When is creating
    if (creating) {
      getJobs(validPickUp.name, validDropOff.name)
        .then(() => {
          // Valid create, set timeout to simulate
          setTimeout(() => {
            setCreating(false);
            onCreate();
          }, 1000);
        })
        .catch(() => {
          // Wrong create, set timeout to simulate
          setTimeout(() => setCreating(false), 1000);
        });
    }
  }, [ creating ]);

  useEffect(() => {
    // When is loadingPickUp
    if (loadingPickUp) {
      getGeocode(pickUp)
        .then((valid) => {
          // Valid pickUp
          const pickUpFormatted = formatMarker(valid);
          setLoadingPickUp(false);
          setValidPickUp(pickUpFormatted);
          setMarkers(getMarkersArray(pickUpFormatted, validDropOff));
          setPickUpStatus(ICON_STATUS.PRESENT);
        })
        .catch(() => {
          // Wrong pickUp
          if (setMarkers) {
            setMarkers(getMarkersArray(null, validDropOff));
          }
          setLoadingPickUp(false);
          setValidPickUp(null);
          setPickUpStatus(ICON_STATUS.ERROR);
        });
    }
  }, [ loadingPickUp ]);

  useEffect(() => {
    // When is loadingDropOff
    if (loadingDropOff) {
      getJobs(validPickUp.name, dropOff)
        .then((valid) => {
          // Valid dropoff
          const dropoffFormatted = formatMarker(valid.dropoff, true);
          setDropOffStatus(ICON_STATUS.PRESENT);
          setValidDropOff(dropoffFormatted);
          setMarkers(getMarkersArray(validPickUp, dropoffFormatted));
          setLoadingDropOff(false);
        })
        .catch(() => {
          // Wrong dropoff
          setMarkers(getMarkersArray(validPickUp, null));
          setDropOffStatus(ICON_STATUS.ERROR);
          setValidDropOff(null);
          setLoadingDropOff(false);
        });
    }
  }, [ loadingDropOff ]);

  return (
    <form className="job-form shadow">
      <Input
        onChange={(address) => {
          if (address && 3 < address.length) {
            setLoadingPickUp(true);
            setPickUp(address);
          } else {
            setPickUpStatus(ICON_STATUS.BLANK);
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
        onChange={(dropOffAddress) => {
          if (dropOffAddress && 3 < dropOffAddress.length) {
            setLoadingDropOff(true);
            setDropOff(dropOffAddress);
          } else {
            setPickUpStatus(ICON_STATUS.BLANK);
          }
        }}
        placeholder="Drop off address"
      />
      <Button
        disabled={creating || !validDropOff || !validPickUp || loadingDropOff || loadingPickUp}
        onClick={() => setCreating(true)}
        text={creating ? 'Creating job...' : 'Create job'}
      />
    </form>
  );
};

JobForm.defaultProps = {
  onCreate: () => true,
  setMarkers: () => true,
};

JobForm.propTypes = {
  onCreate: PropTypes.func,
  setMarkers: PropTypes.func,
};

export default JobForm;

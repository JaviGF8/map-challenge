import React from 'react';
import PropTypes from 'prop-types';

import dropOffBlank from 'assets/dropOffBadgeBlank.svg';
import dropOffError from 'assets/dropOffBadgeError.svg';
import dropOffPresent from 'assets/dropOffBadgePresent.svg';
import pickUpBlank from 'assets/pickUpBadgeBlank.svg';
import pickUpError from 'assets/pickUpBadgeError.svg';
import pickUpPresent from 'assets/pickUpBadgePresent.svg';
import './index.scss';

const ICON_SRC = {
  DROP_OFF: {
    BLANK: dropOffBlank,
    ERROR: dropOffError,
    PRESENT: dropOffPresent,
  },
  PICK_UP: {
    BLANK: pickUpBlank,
    ERROR: pickUpError,
    PRESENT: pickUpPresent,
  },
};

export const ICON_TYPES = {
  DROP_OFF: 'DROP_OFF',
  PICK_UP: 'PICK_UP',
};

export const ICON_STATUS = {
  BLANK: 'BLANK',
  ERROR: 'ERROR',
  PRESENT: 'PRESENT',
};

const Icon = ({ className, status, type }) => (
  <img
    alt="icon"
    className={`custom-icon${className ? ` ${className}` : ''}`}
    src={ICON_SRC[type || ICON_TYPES.DROP_OFF][status || ICON_STATUS.BLANK]}
  />
);

Icon.defaultProps = {
  className: null,
  status: ICON_STATUS.BLANK,
};

Icon.propTypes = {
  className: PropTypes.string,
  status: PropTypes.oneOf(Object.values(ICON_STATUS).map((type) => type)),
  type: PropTypes.oneOf(Object.values(ICON_TYPES).map((type) => type)).isRequired,
};

export default Icon;

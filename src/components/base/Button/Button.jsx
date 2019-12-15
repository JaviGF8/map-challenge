import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Button = ({ className, disabled, text }) => (
  <button className={`custom-btn${className ? ` ${className}` : ''}`} disabled={disabled} type="button">
    {text}
  </button>
);

Button.defaultProps = {
  className: null,
  disabled: false,
  text: null,
};

Button.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  text: PropTypes.string,
};

export default Button;

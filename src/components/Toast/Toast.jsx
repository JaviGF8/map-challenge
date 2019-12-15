import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const Toast = ({ show, text, ...rest }) => (
  <div className={`custom-toast shadow${show ? ' show' : ''}`} {...rest}>
    {text}
  </div>
);

Toast.defaultProps = {
  show: false,
  text: null,
};

Toast.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
};

export default Toast;

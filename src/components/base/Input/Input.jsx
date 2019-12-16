import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import Icon, { ICON_STATUS, ICON_TYPES } from '../Icon/Icon';

const Input = ({ className, iconStatus, iconType, maxLength, onChange, onEnter, value, ...rest }) => {
  const [ inputValue, setInputValue ] = useState('');
  useEffect(() => {
    setInputValue(value);
  }, [ value ]);

  return (
    <div className={`custom-input${className ? ` ${className}` : ''}`}>
      {iconType && <Icon type={iconType} status={iconStatus} />}
      <input
        {...rest}
        onChange={({ target: { value: val } }) => {
          if (maxLength && val > maxLength) {
            val = val.substring(0, maxLength);
          }

          setInputValue(val);
          onChange(val);
        }}
        onKeyPress={(event) => {
          if ('Enter' === event.key && 'function' === typeof onEnter) {
            onEnter(inputValue);
          }
        }}
        value={inputValue}
      />
    </div>
  );
};

Input.defaultProps = {
  className: null,
  iconStatus: null,
  iconType: null,
  maxLength: null,
  onChange: () => true,
  onEnter: null,
  value: '',
};

Input.propTypes = {
  className: PropTypes.string,
  iconStatus: PropTypes.oneOf(Object.values(ICON_STATUS).map((type) => type)),
  iconType: PropTypes.oneOf(Object.values(ICON_TYPES).map((type) => type)),
  maxLength: PropTypes.number,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  value: PropTypes.any,
};

export default Input;

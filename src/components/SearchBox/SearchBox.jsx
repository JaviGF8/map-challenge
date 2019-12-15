import React from 'react';
import './index.scss';
import Input from '../base/Input/Input';
import { ICON_TYPES } from '../base/Icon/Icon';

const SearchBox = () => (
  <div className="search-box shadow">
    <Input iconType={ICON_TYPES.DROP_OFF} />
    <Input iconType={ICON_TYPES.PICK_UP} />
  </div>
);

export default SearchBox;

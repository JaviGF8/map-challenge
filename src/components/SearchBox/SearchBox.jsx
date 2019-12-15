import React from 'react';
import './index.scss';
import Input from '../base/Input/Input';
import { ICON_TYPES } from '../base/Icon/Icon';
import Button from '../base/Button/Button';

const SearchBox = () => (
  <div className="search-box shadow">
    <Input iconType={ICON_TYPES.DROP_OFF} />
    <Input iconType={ICON_TYPES.PICK_UP} />
    <Button text="Create job" />
  </div>
);

export default SearchBox;

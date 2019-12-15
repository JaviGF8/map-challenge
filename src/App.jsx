import React, { useState } from 'react';

import Map from './components/Map';
import JobForm from './components/JobForm';

const App = () => {
  const [ markers, setMarkers ] = useState([]);
  const [ selected, setSelected ] = useState(null);

  return (
    <div className="App">
      <Map markers={markers} selectedMarker={selected} />
      <JobForm
        setMarkers={(newMarkers) => {
          setMarkers(newMarkers);
          setSelected(newMarkers && 0 < newMarkers.length ? newMarkers[newMarkers.length - 1] : null);
        }}
      />
    </div>
  );
};

export default App;

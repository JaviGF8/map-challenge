import React, { useState } from 'react';

import Map from './components/Map';
import JobForm from './components/JobForm';
import Toast from './components/Toast';

const App = () => {
  const [ markers, setMarkers ] = useState([]);
  const [ selected, setSelected ] = useState(null);
  const [ show, setShow ] = useState(false);

  return (
    <div className="App">
      <Map markers={markers} selectedMarker={selected} />
      <JobForm
        setMarkers={(newMarkers) => {
          setMarkers(newMarkers);
          setSelected(newMarkers && 0 < newMarkers.length ? newMarkers[newMarkers.length - 1] : null);
        }}
        onCreate={() => {
          setShow(true);
          setTimeout(() => setShow(false), 5000);
        }}
      />
      <Toast text="Job created successfully" onClick={() => setShow(false)} show={show} />
    </div>
  );
};

export default App;

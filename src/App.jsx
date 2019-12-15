import React, { useState } from 'react';

import Map from './components/Map';
import SearchBox from './components/SearchBox';

const App = () => {
  const [ markers, setMarkers ] = useState([]);
  const [ selected, setSelected ] = useState(null);

  return (
    <div className="App">
      <Map
        markers={
          markers
          // [ { _id: 1, availability: true, geoposition: { lat: 48.86993, lng: 2.334504 }, name: '1' } ]
        }
        selectedMarker={selected}
      />
      <SearchBox
        setMarkers={(newMarkers) => {
          setMarkers(newMarkers);
          setSelected(newMarkers && 0 < newMarkers.length ? newMarkers[newMarkers.length - 1] : null);
        }}
      />
    </div>
  );
};

export default App;

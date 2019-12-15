import React from 'react';

import Map from './components/Map';
import SearchBox from './components/SearchBox';

function App() {
  return (
    <div className="App">
      <Map markers={[ { _id: 1, availability: true, geoposition: { lat: 48.86993, lng: 2.334504 }, name: '1' } ]} />
      <SearchBox />
    </div>
  );
}

export default App;

// App.tsx
import React from 'react';
import GameSpace from './GameSpace';
import './GameSpace.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Simple Game Space</h1>
      <GameSpace width={10} height={10} />
    </div>
  );
};

export default App;

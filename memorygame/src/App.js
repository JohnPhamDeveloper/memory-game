import React from 'react';
import Login from './pages/Login';
import Cards from './components/Cards';
import './app.scss';
import './typography.scss';

function App() {
  // Have setting here for state for number of cards and error check
  // The number of cards must be even or else there will not be a pair that matches
  return (
    <div className="App">
      <Login />

      {/* Play Area */}
      {/* Right side will be the chat */}
      <div className="game-page">
        <Cards numberOfCards={32} />
        <div className="history"></div>
      </div>
    </div>
  );
}

export default App;

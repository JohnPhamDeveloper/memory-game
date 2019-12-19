import React from 'react';
import Login from './pages/Login';
import Game from './pages/Game';
import './default.scss';
import './typography.scss';

const App = () => {
  return (
    <div className="App">
      <Login />
      <Game />
    </div>
  );
};

export default App;

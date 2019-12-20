import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Game from './pages/Game';
import './default.scss';
import './typography.scss';

// Websocket here to get players

const App = () => {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/game">
            <Game username={username} />
          </Route>
          <Route path="/">
            <Login username={username} setUsername={setUsername} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;

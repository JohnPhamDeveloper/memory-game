import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './Game.scss';
import Cards from '../components/Cards';
//import InputText from '../components/InputText';
//import InputButton from '../components/InputButton';
import User from '../components/User';
import Leaderboard from '../components/Leaderboard';

const socket = socketIOClient('http://localhost:4000');

const Game = ({ username }) => {
  const [numberOfCardsField, setNumberOfCardsField] = useState('');
  const [mismatchDelayField, setMismatchDelayField] = useState('');
  const [mismatchDelaySubmit, setMismatchDelaySubmit] = useState(2000);
  const [otherPlayerName, setOtherPlayerName] = useState('');
  const [gameState, setGameState] = useState({});
  const [cardSocketDatas, setCardSocketDatas] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState({});

  useEffect(() => {
    socket.emit('playersUpdate', username);
    socket.on('gameState', data => {
      console.log('my data');
      console.log(data);
      setGameState(data);
      const otherPlayer = data.players.filter(name => name !== username);
      setOtherPlayerName(otherPlayer);
    });

    socket.on('leaderboardUpdate', data => {
      setLeaderboardData(data);
      console.log('leaderboard');
      console.log(data);
    });

    socket.on('mismatchDelayUpdate', data => setMismatchDelaySubmit(data));
    socket.on('cardUpdate', data => {
      console.log('renreder');
      setCardSocketDatas(data);
    });
  }, []);

  useEffect(() => {
    console.log(cardSocketDatas);
  }, [cardSocketDatas]);

  const renderCards = () => {
    if (cardSocketDatas.length <= 1)
      return <div className="card-number-error">Enter number of playing cards!</div>;
    return (
      <Cards
        mismatchDelay={mismatchDelaySubmit}
        cardSocketDatas={cardSocketDatas}
        emitTurnFinished={emitTurnFinished}
        emitCardClicked={emitCardClicked}
        isCurrentTurn={gameState.currentPlayerTurnName === username}
        socket={socket}
        status={gameState.status}
      />
    );
  };

  const onResetGameSubmit = () => {
    // 1) Must reset both players score in server
    socket.emit('reset', true);

    // 2) Reset local variables
  };

  const onCardNumberChange = e => setNumberOfCardsField(e.target.value);
  const onDelayChange = e => setMismatchDelayField(e.target.value);
  const onConfirmCardsSubmit = () => socket.emit('cardUpdate', numberOfCardsField);
  const onDelaySubmit = () => socket.emit('mismatchDelayUpdate', mismatchDelayField);
  const onLeaderboardSubmit = () => setShowLeaderboard(true);
  const onLeaderboardClose = () => setShowLeaderboard(false);
  const emitTurnFinished = () => socket.emit('turnFinished', username);
  const emitCardClicked = index => socket.emit('cardClicked', index);

  return (
    <div
      className="game-page"
      style={
        gameState.currentPlayerTurnName === username
          ? { pointerEvents: 'all' }
          : { pointerEvents: 'none' }
      }
    >
      {renderCards()}
      <div className="history">
        <User
          className={`user-info user-info--1 ${
            gameState.currentPlayerTurnName === username ? 'user-info--active' : ''
          }`}
          username={username}
          score={gameState.score && gameState.score[0]}
        />

        <User
          className={`user-info user-info--2 ${
            gameState.currentPlayerTurnName !== username ? 'user-info--active' : ''
          }`}
          username={otherPlayerName}
          score={gameState.score && gameState.score[1]}
        />

        {/* Number of cards */}
        <div className="number-of-cards-field">
          <input
            className="number-of-cards-input"
            type="text"
            name="number-of-cards-input"
            value={numberOfCardsField}
            placeholder="Number of cards"
            onChange={onCardNumberChange}
          />
          <input
            className="confirm-cards-button"
            type="button"
            name="confirm-cards-button"
            value="Set Cards"
            onClick={onConfirmCardsSubmit}
          />
        </div>

        {/* Mismatch delay */}
        <div className="mismatch-delay-field">
          <input
            className="mismatch-delay-input"
            type="text"
            name="mismatch-delay-input"
            value={mismatchDelayField}
            placeholder="Delay (ms)"
            onChange={onDelayChange}
          />
          <input
            className="mismatch-delay-button"
            type="button"
            name="mismatch-delay-button"
            value="Set Mismatch Delay"
            onClick={onDelaySubmit}
          />
        </div>

        {/* Game status display */}
        <div className="game-state">{`Status: ${gameState.status}`}</div>

        {/* Reset Button */}
        <input
          className="reset-game-button"
          type="button"
          name="reset-game-button"
          value="Reset Game"
          onClick={onResetGameSubmit}
        />

        {/* Leaderboard button */}
        <input
          className="leaderboard-button"
          type="button"
          name="leaderboard-button"
          value="Open Leaderboards"
          onClick={onLeaderboardSubmit}
        />
      </div>
      <Leaderboard
        show={showLeaderboard}
        onClose={onLeaderboardClose}
        leaderboardData={leaderboardData}
      />
    </div>
  );
};

export default Game;

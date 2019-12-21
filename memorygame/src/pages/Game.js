import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './Game.scss';
import Cards from '../components/Cards';
import InputText from '../components/InputText';
import InputButton from '../components/InputButton';
import User from '../components/User';

const socket = socketIOClient('http://localhost:4000');

const Game = ({ username }) => {
  const [numberOfCardsField, setNumberOfCardsField] = useState('');
  const [numberOfCardsSubmit, setNumberOfCardsSubmit] = useState(0);
  const [numberOfCardsSubmitSocket, setNumberOfCardsSubmitSocket] = useState(0);

  const [mismatchDelayField, setMismatchDelayField] = useState('');
  const [mismatchDelaySubmit, setMismatchDelaySubmit] = useState(2000);
  const [mismatchDelaySubmitSocket, setMismatchDelaySubmitSocket] = useState(2000);

  const [otherPlayerName, setOtherPlayerName] = useState('');

  const [gameState, setGameState] = useState({});
  const [cardSocketDatas, setCardSocketDatas] = useState([]);

  // Check if it is the current turn of THIS player
  // 1) server will emit the username of whoevers turn it is currently
  // 2) If the emitted name is not THIS player, then block input for everything...
  // 3) Next players turn when two cards have been selected...

  useEffect(() => {
    socket.emit('playersUpdate', username);
    // socket.on('position', data => console.log(data));
    // socket.on('playerJoin', data => console.log(data));
    socket.on('gameState', data => {
      console.log('my data');
      console.log(data);
      setGameState(data);
      const otherPlayer = data.players.filter(name => name !== username);
      setOtherPlayerName(otherPlayer);
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

  // When turn changes to this playrs turn, render the border box...

  // useEffect(() => {
  //   console.log(gameState);
  // }, [gameState]);

  // useEffect(() => {
  //   socket.emit('cardUpdate', numberOfCardsField);
  // }, [numberOfCardsSubmitSocket]);

  // useEffect(() => {
  //   socket.emit('mismatchDelayUpdate', mismatchDelayField);
  // }, [mismatchDelaySubmitSocket]);

  const onCardNumberChange = e => setNumberOfCardsField(e.target.value);
  const onDelayChange = e => setMismatchDelayField(e.target.value);

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
      />
    );
  };

  const emitTurnFinished = () => socket.emit('turnFinished', username);
  const emitCardClicked = index => socket.emit('cardClicked', index);

  const onConfirmCardsSubmit = () => {
    console.log(numberOfCardsField);
    //setNumberOfCardsSubmitSocket(numberOfCardsField);
    socket.emit('cardUpdate', numberOfCardsField);
  };

  const onDelaySubmit = () => {
    //setMismatchDelaySubmitSocket(mismatchDelayField);
    socket.emit('mismatchDelayUpdate', mismatchDelayField);
  };

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
          <InputText
            inputFor="Number Of Cards"
            value={numberOfCardsField}
            onChange={onCardNumberChange}
          />
          <InputButton inputFor="Confirm Cards" onClick={onConfirmCardsSubmit} />
        </div>

        {/* Mismatch delay */}
        <div className="mismatch-delay-field">
          <InputText
            inputFor="Mismatch Delay"
            value={mismatchDelayField}
            onChange={onDelayChange}
          />
          <InputButton inputFor="Set Mismatch Delay" onClick={onDelaySubmit} />
        </div>

        <div className="game-state">{`Status: ${gameState.status}`}</div>
      </div>
    </div>
  );
};

export default Game;

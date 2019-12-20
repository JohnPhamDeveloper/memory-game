import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './Game.scss';
import Cards from '../components/Cards';
import InputText from '../components/InputText';
import InputButton from '../components/InputButton';

const socket = socketIOClient('http://localhost:4000');

const Game = ({ username }) => {
  const [numberOfCardsField, setNumberOfCardsField] = useState('');
  const [numberOfCardsSubmit, setNumberOfCardsSubmit] = useState(0);
  const [numberOfCardsSubmitSocket, setNumberOfCardsSubmitSocket] = useState(0);

  const [mismatchDelayField, setMismatchDelayField] = useState('');
  const [mismatchDelaySubmit, setMismatchDelaySubmit] = useState(2000);
  const [mismatchDelaySubmitSocket, setMismatchDelaySubmitSocket] = useState(2000);

  useEffect(() => {
    socket.on('position', data => console.log(data));
    socket.on('playerJoin', data => console.log(data));
    socket.on('mismatchDelayUpdate', data => setMismatchDelaySubmit(data));
    socket.on('cardUpdate', data => setNumberOfCardsSubmit(data));
  }, []);

  // useEffect(() => {
  //   socket.emit('cardUpdate', numberOfCardsField);
  // }, [numberOfCardsSubmitSocket]);

  // useEffect(() => {
  //   socket.emit('mismatchDelayUpdate', mismatchDelayField);
  // }, [mismatchDelaySubmitSocket]);

  const onCardNumberChange = e => setNumberOfCardsField(e.target.value);
  const onDelayChange = e => setMismatchDelayField(e.target.value);

  const renderCards = () => {
    if (numberOfCardsSubmit <= 1)
      return <div className="card-number-error">Enter number of play cards greater than 2!</div>;

    return <Cards numberOfCards={numberOfCardsSubmit} mismatchDelay={mismatchDelaySubmit} />;
  };

  const onConfirmCardsSubmit = () => {
    console.log(numberOfCardsField);
    //setNumberOfCardsSubmitSocket(numberOfCardsField);
    socket.emit('cardUpdate', numberOfCardsField);
  };

  const onDelaySubmit = () => {
    //setMismatchDelaySubmitSocket(mismatchDelayField);
    socket.emit('mismatchDelayUpdate', mismatchDelayField);
  };

  // TODO: pass delay change into Cards
  return (
    <div className="game-page">
      {renderCards()}
      <div className="history">
        {/* User info */}
        <div className="user-info user-info--1">
          {/* Profile Icon */}
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="user"
            className="svg-inline--fa fa-user fa-w-14"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
            ></path>
          </svg>
          <h2>{username}</h2>
        </div>

        <div className="user-info user-info--2">
          {/* Profile Icon */}
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="user"
            className="svg-inline--fa fa-user fa-w-14"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"
            ></path>
          </svg>
          <h2>Joey</h2>
        </div>

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
      </div>
    </div>
  );
};

export default Game;

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import useTimer from '../components/useTimer';
import socketIOClient from 'socket.io-client';
import './game.scss';
import Cards from '../components/Cards';
import User from '../components/User';
import Leaderboard from '../components/Leaderboard';
import Modal from '../components/Modal';

const socket = socketIOClient('http://localhost:4000');

const Game = ({ username }) => {
  const [numberOfCardsField, setNumberOfCardsField] = useState('');
  const [mismatchDelayField, setMismatchDelayField] = useState('');
  const [mismatchDelaySubmit, setMismatchDelaySubmit] = useState(2000);
  const [resetCards, setResetCards] = useState(true);
  const [otherPlayerName, setOtherPlayerName] = useState('');
  const [gameState, setGameState] = useState({});
  const [cardSocketDatas, setCardSocketDatas] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [showFinishScreen, setShowFinishScreen] = useState(false);
  const [cardsClickedIndexes, setCardsClickedIndexes] = useState([]);
  const [blockMouse, setBlockMouse] = useState(false);
  const [timeText] = useTimer();

  useEffect(() => {
    socket.emit('playersUpdate', username);

    socket.on('cardClicked', currentCardsClickedIndexes => {
      setCardsClickedIndexes(currentCardsClickedIndexes);
    });

    socket.on('gameState', data => {
      setGameState(data);
      const otherPlayer = data.players.filter(name => name !== username);
      setOtherPlayerName(otherPlayer);
    });

    socket.on('leaderboardUpdate', data => {
      setLeaderboardData(data);
      console.log('leaderboard');
    });

    socket.on('mismatchDelayUpdate', data => setMismatchDelaySubmit(data));

    socket.on('cardUpdate', data => {
      setCardSocketDatas(data);
    });
  }, []);

  useEffect(() => {
    if (gameState.gameOver) {
      setShowFinishScreen(true);
    } else {
      setShowFinishScreen(false);
    }
  }, [gameState.gameOver]);

  useEffect(() => {
    if (gameState.reset) {
      setResetCards(true);
    } else {
      setResetCards(false);
    }
  }, [gameState.reset]);

  const renderCards = () => {
    if (cardSocketDatas.length <= 1)
      return <div className="card-number-error">Enter number of playing cards!</div>;
    return (
      <Cards
        onCardClick={onCardClick}
        onCardsWillCompare={onCardsWillCompare}
        onCardsMatched={onCardsMatched}
        onCardsMismatched={onCardsMismatched}
        showCardsOfIndexes={cardsClickedIndexes}
        resetCards={resetCards}
        cardsClickedIndexes={cardsClickedIndexes}
        mismatchDelay={mismatchDelaySubmit}
        cardsDatas={cardSocketDatas}
        onCardsDidCompare={onCardsDidCompare}
      />
    );
  };

  const onResetGameSubmit = () => socket.emit('reset', true);
  const onFinishScreenClose = () => setShowFinishScreen(false);
  const onCardNumberChange = e => setNumberOfCardsField(e.target.value);
  const onDelayChange = e => setMismatchDelayField(e.target.value);
  const onConfirmCardsSubmit = () => socket.emit('cardUpdate', numberOfCardsField);
  const onDelaySubmit = () => socket.emit('mismatchDelayUpdate', mismatchDelayField);
  const onLeaderboardSubmit = () => setShowLeaderboard(true);
  const onLeaderboardClose = () => setShowLeaderboard(false);
  const emitTurnFinished = () => socket.emit('turnFinished', username);
  const emitCardClicked = index => socket.emit('cardClicked', index);
  const emitCardsMatched = cards => socket.emit('matchCardsUpdate', cards);
  const onCardClick = index => emitCardClicked(index);
  const isCurrentTurn = () => gameState.currentPlayerTurnName === username;

  const onCardsWillCompare = () => {
    if (isCurrentTurn()) {
      setBlockMouse(true);
    }
  };

  const onCardsMatched = cards => {
    // if (isCurrentTurn()) {
    //   emitCardsMatched(cards);
    //  // emitTurnFinished();
    //   setBlockMouse(false);
    //   setCardsClickedIndexes([]);
    // }
  };

  const onCardsDidCompare = cardsMatched => {
    if (isCurrentTurn()) {
      emitCardsMatched({ username, cards: cardsMatched });
      emitTurnFinished();
      setBlockMouse(false);
      setCardsClickedIndexes([]);
    }
  };

  const onCardsMismatched = () => {
    // if (isCurrentTurn()) {
    //   //emitTurnFinished();
    //   setBlockMouse(false);
    //   setCardsClickedIndexes([]);
    // }
  };

  const hasThisPlayerWon = () =>
    gameState.playerDataObjects[username].score >
    gameState.playerDataObjects[otherPlayerName].score;

  const hasOtherPlayerWon = () =>
    gameState.playerDataObjects[username].score <
    gameState.playerDataObjects[otherPlayerName].score;

  const renderGameoverMessage = () => {
    if (
      !gameState ||
      !gameState.playerDataObjects ||
      !gameState.playerDataObjects[otherPlayerName] ||
      !gameState.playerDataObjects[username]
    )
      return <></>;

    let message = '';
    // THIS player won
    if (hasThisPlayerWon()) {
      message = 'You Win!';
    } else if (hasOtherPlayerWon()) {
      message = 'You Lose!';
    } else {
      message = 'You Tied!';
    }

    return <h2>{message}</h2>;
  };

  return (
    <div
      className="game-page"
      style={isCurrentTurn() && !blockMouse ? { pointerEvents: 'all' } : { pointerEvents: 'none' }}
    >
      {renderCards()}
      <div className="history">
        <User
          className={`user-info user-info--1 ${
            gameState.currentPlayerTurnName === username ? 'user-info--active' : ''
          }`}
          username={username}
          score={
            gameState && gameState.playerDataObjects && gameState.playerDataObjects[username].score
          }
        />

        <User
          className={`user-info user-info--2 ${
            gameState.currentPlayerTurnName !== username ? 'user-info--active' : ''
          }`}
          username={otherPlayerName}
          score={
            gameState &&
            gameState.playerDataObjects &&
            gameState.playerDataObjects[otherPlayerName] &&
            gameState.playerDataObjects[otherPlayerName].score
          }
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

        {/* Timer display */}
        <p className="time-text">{timeText}</p>

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
      <Modal show={showFinishScreen} onClose={onFinishScreenClose}>
        {renderGameoverMessage()}
      </Modal>
    </div>
  );
};

export default Game;

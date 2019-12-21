const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);
const cors = require('cors');

express.use(cors());

let gameStarted = false;
let numberOfCards = 0;
let mismatchDelay = 1000;
let cardsData = [];
let playerDatas = [];
let matchedCardIndexes = [];
let currentPlayerTurnIndex = 0;
let score = [0, 0]; // Would change playerDatas to an object with this included, but would require refactoring in frontend (no time)

const matchPointIncrement = 100;

// Client connection
socketio.on('connection', socket => {
  socket.on('cardUpdate', data => {
    console.log('Updating cards: ', data);
    numberOfCards = data;

    // Generate new playing cards
    cardsData = generatePlayingCards();
    shuffle(cardsData);

    // Send back the new cards
    socketio.emit('cardUpdate', cardsData);
  });

  socket.on('matchCardsUpdate', data => {
    matchedCardIndexes.push(...data);
    score[currentPlayerTurnIndex] += matchPointIncrement;
  });

  // Add player names
  socket.on('playersUpdate', data => {
    if (data && playerDatas.length < 2) playerDatas.push(data);
    console.log(playerDatas);

    // Start game with two players
    if (playerDatas.length >= 2 && !gameStarted) {
      currentPlayerTurnName = playerDatas[0]; // This players turn

      socketio.emit('gameState', {
        started: true,
        currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
        players: playerDatas,
        status: 'Game started...',
        score,
      });
    } else {
      socketio.emit('gameState', {
        started: false,
        currentPlayerTurnName: '',
        players: playerDatas,
        status: 'Need more players...',
        score,
      });
    }
  });

  // Tell other client that card was clicked
  socket.on('cardClicked', data => {
    socket.broadcast.emit('cardClicked', data);
  });

  socket.on('turnFinished', data => {
    currentPlayerTurnIndex = (currentPlayerTurnIndex + 1) % playerDatas.length;
    console.log('current player turn index: ', currentPlayerTurnIndex);
    // Game is over
    if (matchedCardIndexes.length === cardsData.length) {
      socketio.emit('gameState', {
        started: false,
        currentPlayerTurnName: '',
        players: playerDatas,
        status: 'Game over!',
        score,
      });
    } else {
      socketio.emit('gameState', {
        started: gameStarted,
        currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
        players: playerDatas,
        status: `Turn waiting...`,
        score,
      });
    }
  });

  socket.on('mismatchDelayUpdate', data => {
    console.log('Updating delay: ', data);
    mismatchDelay = data;
  });
});

http.listen(4000, () => {
  console.log('Listening on port 4000');
});

const shuffle = cardsData => {
  for (let i = cardsData.length - 1; i > 0; i--) {
    // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    const j = Math.floor(Math.random() * i);
    const temp = cardsData[i];
    cardsData[i] = cardsData[j];
    cardsData[j] = temp;
  }
};

const generatePlayingCards = () => {
  const tempCards = [];

  for (let i = 1; i <= numberOfCards; i++) {
    const cardData = {
      number: i,
    };

    const cardData2 = {
      number: i,
    };

    tempCards.push(cardData, cardData2);
  }

  return tempCards;
};

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
let currentPlayerTurnIndex = 0;

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

  // Add player names
  socket.on('playersUpdate', data => {
    if (data) playerDatas.push(data);
    console.log(playerDatas);

    // Start game with two players
    // if (playerDatas.length >= 2 && !gameStarted) {
    gameStarted = true;
    currentPlayerTurnName = playerDatas[0]; // This players turn

    socketio.emit('gameState', {
      started: gameStarted,
      currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
    });
  });

  socket.on('turnFinished', data => {
    currentPlayerTurnIndex = (currentPlayerTurnIndex + 1) % playerDatas.length;
    console.log('current player turn index: ', currentPlayerTurnIndex);

    socketio.emit('gameState', {
      stated: gameStarted,
      currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
    });
  });

  socket.on('mismatchDelayUpdate', data => {
    console.log('Updating delay: ', data);
    mismatchDelay = data;
  });
});

http.listen(4000, () => {
  console.log('Listening on port 4000');
});

// 1) Generate cards up to the number of card counts * 2

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

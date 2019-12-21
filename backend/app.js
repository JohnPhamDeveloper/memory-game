const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);
const cors = require('cors');

express.use(cors());

let leaderboard = {};
let gameStarted = false;
let numberOfCards = 0;
let mismatchDelay = 1000;
let cardsData = [];
let playerDatas = [];
let matchedCardIndexes = [];
let currentPlayerTurnIndex = 0;
let score = [0, 0]; // Would change playerDatas to an object with this included, but would require refactoring in frontend (no time)

const matchPointIncrement = 100;

/* * * * * * * * * * *
 * CLIENT CONNECTION *
 * * * * * * * * * * * */
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

  /* * * * * * * * *
   * CARDS MATCHED *
   * * * * * * * * */
  socket.on('matchCardsUpdate', data => {
    matchedCardIndexes.push(...data);
    score[currentPlayerTurnIndex] += matchPointIncrement;

    // Set new higher score
    const username = playerDatas[currentPlayerTurnIndex];
    console.log('leaderboard');
    console.log(score[currentPlayerTurnIndex]);
    console.log(leaderboard[playerDatas[currentPlayerTurnIndex]].score);
    if (
      leaderboard &&
      leaderboard[playerDatas[currentPlayerTurnIndex]] &&
      leaderboard[playerDatas[currentPlayerTurnIndex]].score <
        score[currentPlayerTurnIndex]
    ) {
      leaderboard[playerDatas[currentPlayerTurnIndex]].score =
        score[currentPlayerTurnIndex];
    }

    console.log(leaderboard);

    const arrayLeaderboard = Object.keys(leaderboard).map(key => {
      return {
        username: key,
        score: leaderboard[key].score,
      };
    });

    console.log(arrayLeaderboard);

    arrayLeaderboard.sort((a, b) => (a.score < b.score ? 1 : -1));
    socketio.emit('leaderboardUpdate', arrayLeaderboard);
  });

  /* * * * * * * * * * * *
   * ADD PLAYER TO GAME  *
   * * * * * * * * * * * */
  socket.on('playersUpdate', data => {
    if (data && playerDatas.length < 2) {
      leaderboard[data] = {
        score: 0,
      };
      playerDatas.push(data);
    }
    console.log(playerDatas);

    // Start game with two players
    if (playerDatas.length >= 2 && !gameStarted) {
      currentPlayerTurnName = playerDatas[0]; // This players turn

      socketio.emit('gameState', {
        started: true,
        currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
        players: playerDatas,
        status: 'Game Started',
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

  /* * * * * * * * * * * * * *
   * CARD CLICKED IN CLIENT  *
   * * * * * * * * * * * * * */
  socket.on('cardClicked', data => {
    socketio.emit('cardClicked', data);
  });

  /* * * * * * *
   * RESET GAME *
   * * * * * * */
  socket.on('reset', data => {
    if (data === true) {
      numberOfCards = 0;
      cardsData = [];
      matchedCardIndexes = [];
      currentPlayerTurnIndex = 0;
      score = [0, 0];
    }

    // Send new game state back for reset
    socketio.emit('gameState', {
      started: true,
      currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
      players: playerDatas,
      status: 'Game Resetted',
      score,
    });
  });

  /* * * * * * * * *
   * TURN FINISHED *
   * * * * * * * * * */
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

  /* * * * * * * * * * * * *
   * MISMATCH DELAY UPDATE *
   * * * * * * * * * * * * */
  socket.on('mismatchDelayUpdate', data => {
    console.log('Updating delay: ', data);
    mismatchDelay = data;
    socketio.emit('mismatchDelayUpdate', data);
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

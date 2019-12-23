const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);
const cors = require('cors');

express.use(cors());

let gameStarted = false;
let numberOfCards = 0;
const leaderboard = {};
//let mismatchDelay = 1000;
let cardsData = [];
let playerDatas = []; // Only username, turn order
let playerDataObjects = {}; // object for all players with username as key
let matchedCardIndexes = [];
let currentCardsClickedIndexes = [];
let currentPlayerTurnIndex = 0;
let currentPlayerTurnName = '';

const matchPointIncrement = 100;

/* * * * * * * * * * *
 * CLIENT CONNECTION *
 * * * * * * * * * * * */
socketio.on('connection', socket => {
  /**
   * CARD NUMBER SUBMISSION
   */
  socket.on('cardUpdate', data => {
    //reset();
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
   * {
   *    cards: [int]
   *    username: [string]
   * }
   * * * * * * * * */
  socket.on('matchCardsUpdate', data => {
    if (data.cards.length <= 0) return;

    console.log(data);
    // Add matched cards to count towards ending the game
    matchedCardIndexes.push(...data.cards);

    // Increment the score for the person who made that match
    playerDataObjects[data.username] = {
      score: (playerDataObjects[data.username].score += matchPointIncrement),
    };

    // Change user leaderboard score if their current score is higher
    if (
      leaderboard[data.username].score < playerDataObjects[data.username].score
    ) {
      leaderboard[data.username].score = playerDataObjects[data.username].score;
    }

    // Update leaderboard
    const arrayLeaderboard = Object.keys(leaderboard).map(key => {
      return {
        username: key,
        score: leaderboard[key].score,
      };
    });

    //console.log(arrayLeaderboard);

    // Sort from highest score to lowest
    arrayLeaderboard.sort((a, b) => (a.score < b.score ? 1 : -1));
    socketio.emit('leaderboardUpdate', arrayLeaderboard);
  });

  /* * * * * * * * * * * *
   * ADD PLAYER TO GAME  *
   * * * * * * * * * * * */
  socket.on('playersUpdate', username => {
    // New user to leaderboard
    if (!leaderboard[username]) {
      leaderboard[username] = {
        score: 0,
      };
    }

    // Max two players only
    if (username && playerDatas.length < 2) {
      // leaderboard[username] = {
      //   score: 0,
      // };
      playerDataObjects[username] = {
        score: 0,
      };
      playerDatas.push(username);
    }
    // console.log(playerDatas);

    // Start game with two players
    if (playerDatas.length >= 2 && !gameStarted) {
      currentPlayerTurnName = playerDatas[0]; // This players turn

      socketio.emit('gameState', {
        started: true,
        currentPlayerTurnName,
        playerDataObjects,
        currentPlayerTurnIndex,
        currentPlayerTurnInformation: playerDataObjects[currentPlayerTurnName],
        players: playerDatas,
        gameOver: false,
        status: 'Game Started',
      });
    } else {
      socketio.emit('gameState', {
        started: false,
        playerDataObjects,
        currentPlayerTurnIndex,
        currentPlayerTurnInformation: playerDataObjects[currentPlayerTurnName],
        currentPlayerTurnName: '',
        players: playerDatas,
        gameOver: false,
        status: 'Need more players...',
      });
    }
  });

  /* * * * * * * * * * * * * *
   * CARD CLICKED IN CLIENT  *
   * * * * * * * * * * * * * */
  socket.on('cardClicked', index => {
    currentCardsClickedIndexes.push(index);
    socketio.emit('cardClicked', currentCardsClickedIndexes);
  });

  /* * * * * * *
   * RESET GAME *
   * * * * * * */
  socket.on('reset', data => {
    reset();
  });

  /* * * * * * * * *
   * TURN FINISHED *
   * * * * * * * * * */
  socket.on('turnFinished', data => {
    // Tell client that there's no cards selected
    currentCardsClickedIndexes = [];
    socketio.emit('cardClicked', currentCardsClickedIndexes);

    currentPlayerTurnIndex = (currentPlayerTurnIndex + 1) % playerDatas.length;
    currentPlayerTurnName = playerDatas[currentPlayerTurnIndex];
    console.log('current player turn index: ', currentPlayerTurnIndex);

    // Game is over
    if (allCardsMatched()) {
      socketio.emit('gameState', {
        started: false,
        playerDataObjects,
        currentPlayerTurnIndex,
        currentPlayerTurnName,
        currentPlayerTurnInformation: playerDataObjects[currentPlayerTurnName],
        players: playerDatas,
        status: 'Game over!',
        gameOver: true,
      });
    } else {
      socketio.emit('gameState', {
        started: true,
        playerDataObjects,
        currentPlayerTurnIndex,
        currentPlayerTurnName,
        currentPlayerTurnInformation: playerDataObjects[currentPlayerTurnName],
        players: playerDatas,
        gameOver: false,
        reset: false,
        status: `${currentPlayerTurnName} turn...`,
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

const allCardsMatched = () => matchedCardIndexes.length === cardsData.length;

const reset = () => {
  numberOfCards = 0;
  cardsData = [];
  matchedCardIndexes = [];
  currentCardsClickedIndexes = [];

  // Reset score
  playerDatas.forEach(playerData => {
    playerDataObjects[playerData].score = 0;
  });

  // Send new game state back for reset
  socketio.emit('gameState', {
    started: true,
    playerDataObjects,
    currentPlayerTurnIndex,
    currentPlayerTurnInformation: playerDataObjects[currentPlayerTurnName],
    currentPlayerTurnName: playerDatas[currentPlayerTurnIndex],
    players: playerDatas,
    reset: true,
    gameOver: false,
    status: 'Game Resetted',
  });
};

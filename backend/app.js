const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);
const cors = require('cors');

express.use(cors());

let numberOfCards = 0;
let mismatchDelay = 1000;

// Client connection
socketio.on('connection', socket => {
  socket.on('cardUpdate', data => {
    console.log('Updating cards: ', data);
    numberOfCards = data;
  });

  socket.on('mismatchDelayUpdate', data => {
    console.log('Updating delay: ', data);
    mismatchDelay = data;
  });
});

http.listen(4000, () => {
  console.log('Listening on port 4000');
});

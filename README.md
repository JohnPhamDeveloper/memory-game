# Memory Game

## How to run
1) Navigate to the directory "backend" with your terminal
2) Run "npm i" to install dependencies
3) In your terminal, run "node app" to run the websocket server (multiplayer)
4) Navigate to the directory "memorygame"
5) Run "npm i" to install dependencies
6) Run "npm run start" to launch the website on http://localhost:3000

## Suggested Window Playing Environment
![Game Area](https://imgur.com/OiGySBm.jpg)

## Run tests
1) Navigate to the directory "memorygame"
2) Run "npm run test"
3) Run "npm run test -- --coverage" for coverage on the cards game

## Features
* Multiplayer
* Time tracker
* Adjustable cards
* Turn order (border box around whoever turn belongs to)
* Reset
* Leaderboards/Best score (stored in memory on server)
* Win/Lose/Tied message

## Aside
* The number of cards displayed is the number of cards multiplied by 2 (so there's a match for every card)
* Must restart the "How to run" steps if someone disconnects or refresh
* 2 weeks to do and christmas is coming, so I cannot write every tests!

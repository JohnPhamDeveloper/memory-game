# Memory Game

## Node version
v10.16.3

## Features
* Multiplayer
* Time tracker
* Adjustable cards
* Turn order (border box around whoever turn belongs to)
* Reset
* Leaderboards/Best score (stored in memory on server)
* Win/Lose/Tied message
* Randomized Layout

## How to run
1) Navigate to the directory "backend" with your terminal
2) Run "npm i" to install dependencies
3) In your terminal, run "node app" to run the websocket server (multiplayer)
4) Navigate to the directory "memorygame"
5) Run "npm i" to install dependencies
6) Run "npm run start" to launch the website on http://localhost:3000
7) Have two browsers navigate to http://localhost:3000 and type in a username (Do not login with more than two browsers!)
8) Game!

## Aside
* **Don't set the cards while the game is ongoing**; instead, hit the reset game buton, then set the cards.
* The number of cards displayed is the number of cards multiplied by 2 (so there's a match for every card)
* Must restart the "How to run" steps if someone disconnects or refresh
* 2 weeks to do and christmas is coming, so I cannot write every tests and refactor! Tests are focused on cards game components.
* Whoever owns the turn gets to set the card number.

## Suggested Window Playing Environment
![Game Area](https://imgur.com/OiGySBm.jpg)

## Run tests
1) Navigate to the directory "memorygame"
2) Run "npm run test" then hit the "a" key.
3) Run "npm run test -- --coverage --watchAll=false" for test coverage on the cards game





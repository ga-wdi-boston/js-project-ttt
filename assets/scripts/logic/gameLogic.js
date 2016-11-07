'use strict'

//const events = require('../auth/events.js');
const store = require('../store.js');

let player = "x";
let winner = null;
let turns = 1;
let gameData = {};

const newGame = function(gameType) {
  for(let i = 0; i < 9; i++) {
    $('#space'+i).attr('src', "./assets/images/blankSpace.png");
  }
  let gameGrid = [];
  for(let i = 0; i<9; i++) {gameGrid.push(i+9)};
  player = "x";
  winner = null;
  turns = 1;
  gameData = {
    game: {
      cells: gameGrid,
      over: false,
      player_x: {
        id: store.user.id,
        email: store.user.email
      },
      player_o: {}
    }
  };
  if(gameType === "Hot-Seat") {gameData.game.player_o.email = "guest";}
  store.gameInProgress = gameData;
}

const checkWin = function() {
  let gameGrid = store.gameInProgress.game.cells;
  for (let i = 1; i < 5; i++) {
    if(i !== 2)
    {
      if(gameGrid[0] === gameGrid[0+i] && gameGrid[0] === gameGrid[0+(2*i)] && gameGrid[0]!= "") {
        winner = gameGrid[0]
        $('#winner-text').text((winner+" wins!").toUpperCase());
        return winner;
      }
      else if (gameGrid[8] === gameGrid[8-i] && gameGrid[8] === gameGrid[8-(2*i)] && gameGrid[8]!= "") {
        winner = gameGrid[8]
        $('#winner-text').text((winner+" wins!").toUpperCase());
        return winner;
      }
    }
    if (gameGrid[4] === gameGrid[4+i] && gameGrid[4] === gameGrid[4-i] && gameGrid[4]!= "") {
      winner = gameGrid[4]
      $('#winner-text').text((winner+" wins!").toUpperCase());
      return winner;
    }
    else {
      let letters = 0;
      for(let i in gameGrid)
      {
        if(gameGrid[i] == 'x')
        {
          letters+= 1;
        }
      }
      if(letters == 5) {
          winner = "draw";
          $('#winner-text').text("It's a Draw!");
          return winner;
      }
    }
  }
}

const checkPastWins = function(data) {
  let gameGrid = data;
  for (let i = 1; i < 5; i++) {
    if(i !== 2)
    {
      if(gameGrid[0] === gameGrid[0+i] && gameGrid[0] === gameGrid[0+(2*i)] && gameGrid[0]!= "") {
        return gameGrid[0];
      }
      else if (gameGrid[8] === gameGrid[8-i] && gameGrid[8] === gameGrid[8-(2*i)] && gameGrid[8]!= "") {
        return gameGrid[8];
      }
    }
    if (gameGrid[4] === gameGrid[4+i] && gameGrid[4] === gameGrid[4-i] && gameGrid[4]!= "") {
      return gameGrid[4];
    }
    else {
      let letters = 0;
      for(let i in gameGrid)
      {
        if(gameGrid[i] == 'x')
        {
          letters+= 1;
        }
      }
      if(letters == 5) {
          return "draw";
      }
    }
  }
}

const turn = function(space) {
  let gameGrid = store.gameInProgress.game.cells;
  if(player === "x" && gameGrid[(space/1)] !== "o" && gameGrid[(space/1)] !== "x" && winner === null) {
    gameGrid[(space/1)] = "x";
    $('#space'+space).attr('src', "./assets/images/x.png");
    player = "o";
    checkWin();
    turns += 1;
  }
  else if (gameGrid[(space/1)] !== "x" && gameGrid[(space/1)] !== "o" && winner === null){
    gameGrid[(space/1)] = "o";
    $('#space'+space).attr('src', "./assets/images/o.png");
    player = "x";
    checkWin();
    turns +=1;
  }
  store.turn = turns;
  store.gameInProgress.game.cells = gameGrid;
  store.gameInProgress.game.over = !!winner;
}

const clearBoard = function () {
  for (let i = 0; i < 9; i++) {
    $("#space"+i).attr('src', './assets/images/blankSpace.png');
  }
}

module.exports = {
  turn,
  newGame,
  checkPastWins,
  clearBoard,
}

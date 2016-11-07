'use strict';

const store = require('../store.js');
const events = require('./events.js');
const gameLogic = require('../logic/gameLogic.js');
const api = require('./api.js');

const success = function(data)
{
  $('#messages').text('success');
};

const signUpSuccess = function(data)
{
  store.token = data.user.token;
  $('#sign-up-modal').modal('hide');
  signInSuccess(data);
};

const signInSuccess = function(data)
{
  store.user = data.user;
  $('#messages').text('User signed in!');
  $('#sign-in-modal').modal('hide');
  $('#sign-in-button').html("<form id='sign-out'><input type='submit' name='submit' value='Sign Out!' class='btn btn-primary btn-lg'></form>");
  $('#sign-up-button').html('<button type="button" class="btn btn-primary btn-lg" data-toggle="modal"data-target="#change-password-modal">Change Password</button>');
  $('#account-menu').text(store.user.email.split('@')[0]+"'s Account");
  $('#new-game-buttons').show();

};

const changePasswordSuccess = function(data)
{
  $('#messages').text('Password Changed!');
  $('#change-password-modal').modal('hide');
};

const signOutSuccess = function()
{
  store.user = null;
  $('#messages').text('User signed out!');
  $('#sign-in-button').html('<button type="button" class="btn btn-primary btn-lg" data-toggle="modal"data-target="#sign-in-modal">Sign In</button>');
  $('#sign-up-button').html('<button type="button" class="btn btn-primary btn-lg" data-toggle="modal" data-target="#sign-up-modal">Sign Up</button>');
  $('#account-menu').text('Sign up/in');
  $('#new-game-buttons').hide();
  gameLogic.winner = "Nobody";
}

const turnSuccess = function()
{

}

const getGameSuccess = function(data) {
    console.log(data);
    let games = [0,0]; //played, won
    for(let i in data.games) {
      games[0]+=1;
      if(data.games[i].over)
      {
        if(gameLogic.checkWin(data.games[i].cells) === "x")
        {
          games[1] += 1;
        }
      }
    }
    $("#player-1-stats").text("Played: "+games[0]+" Won: "+games[1]);
}

const updateGameSuccess = function(data)
{
}

const createGameSuccess = function(data)
{
  $('#new-game-buttons').hide();
  $('.forfeit').show();
  $('.saveQuit').show();
  $('#winner-text').text("");

}

const getGameIdSuccess = function (data) {
  let gameId;
  let games = [0,0]; //played, won
  console.log(data);
  store.sessionID = 0;
  let i;
  for(i in data.games) {
    games[0] += 1;
    if(store.user.email === data.games[i].player_x.email && data.games[i].id > store.sessionID) {
      store.sessionID = data.games[i].id;
    }
    if(data.games[i].over) {
      if(gameLogic.checkPastWins(data.games[i].cells) === "x") {
        games[1] += 1;
      }
    }
  }
  $('#session-id-display').text("Session ID: "+store.sessionID);
  $("#player-1-stats").text("Played: "+games[0]+" Won: "+games[1]);
}

const loadGameSuccess = function (data) {
  if(!data.game.over) {
    store.sessionID = data.game.id;
    store.gameInProgress = data;
    $('#session-id-display').text("Session ID: "+store.sessionID);
    store.gameInProgress.game.cells = data.game.cells;
    gameLogic.winner = null;
    let xVO = 0;
    for(let i in store.gameInProgress.game.cells) {
      if(store.gameInProgress.game.cells[i] !== "") {
        $('#space'+i).attr('src', "./assets/images/"+store.gameInProgress.game.cells[i]+".png");
        store.gameInProgress.game.cells[i] === "x" ? xVO += 1 : xVO -= 1;
      }
    }
    xVO <= 0 ? gameLogic.player = "x" : gameLogic.player = "o";
    createGameSuccess();
  }
}

const failure = (error) => {
  console.error(error);
  $('#messages').text('failure');
};

module.exports = {
  failure,
  success,
  signUpSuccess,
  signInSuccess,
  changePasswordSuccess,
  signOutSuccess,
  createGameSuccess,
  turnSuccess,
  getGameSuccess,
  updateGameSuccess,
  getGameIdSuccess,
  loadGameSuccess,
};

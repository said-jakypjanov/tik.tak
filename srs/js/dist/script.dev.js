"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var origBoard;
var huPlayer = "0";
var aiPlayer = "X";
var winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]];
var cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background");
    cells[i].addEventListener('click', turnClick);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] === 'number') {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  var gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  var plays = board.reduce(function (a, e, i) {
    return e === player ? a.concat(i) : a;
  }, []);
  var gameWon = null;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = winCombos.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          win = _step$value[1];

      if (win.every(function (elem) {
        return plays.indexOf(elem) > -1;
      })) {
        gameWon = {
          index: index,
          player: player
        };
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return gameWon;
}

function gameOver(gameWon) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = winCombos[gameWon.index][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var index = _step2.value;
      document.getElementById(index).style.background = gameWon.player === huPlayer ? "deepskyblue" : "red";
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick);
  }

  declareWinner(gameWon.player === huPlayer ? "You Win!" : "You Lose!");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".text").innerText = who;
}

function emptySquares() {
  return origBoard.filter(function (s) {
    return typeof s === "number";
  });
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.background = "green";
      cells[i].removeEventListener("click", turnClick);
    }

    declareWinner("Tie Game!");
    return true;
  }

  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return {
      score: -10
    };
  } else if (checkWin(newBoard, aiPlayer)) {
    return {
      score: 10
    };
  } else if (availSpots.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];

  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var _result = minimax(newBoard, aiPlayer);

      move.score = _result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;

  if (player === aiPlayer) {
    var bestScore = -10000;

    for (var _i2 = 0; _i2 < moves.length; _i2++) {
      if (moves[_i2].score > bestScore) {
        bestScore = moves[_i2].score;
        bestMove = _i2;
      }
    }
  } else {
    var _bestScore = 10000;

    for (var _i3 = 0; _i3 < moves.length; _i3++) {
      if (moves[_i3].score < _bestScore) {
        _bestScore = moves[_i3].score;
        bestMove = _i3;
      }
    }
  }

  return moves[bestMove];
}
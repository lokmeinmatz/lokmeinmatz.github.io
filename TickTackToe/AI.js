const DIFFICULTY_EASY = 4123,
      DIFFICULTY_HARD = 4131;

function getAImove(board, difficulty){
  if(difficulty == DIFFICULTY_EASY){
    //return random free possible location
    var moves = getPossibleMoves(board);
    console.log(moves);
    loadingTime = 0;
    return moves[floor(random(moves.length))];
  }
  else if(difficulty == DIFFICULTY_HARD){
    var choice = miniMax(board, 2, 0);
    loadingTime = 0;
    console.log("finished");
    return choice;
  }
}

function AIaction(move){
  this.move = move;

  this.miniMaxValue = 0;

  this.applyTo = function(state) {
    var next = new GameState(state);
    next.board[this.move.x][this.move.y] = state.turn;

    if(state.turn == 2)next.AImovesCount++;
    next.advanceTurn();

    return next;
  }
}

AIaction.ASCENDING = function(firstAction, secondAction) {
  if(firstAction.miniMaxValue < secondAction.miniMaxValue)return -1;
  else if(firstAction.miniMaxValue > secondAction.miniMaxValue)return 1;
  return 0;
}

AIaction.DESCENDING = function(firstAction, secondAction) {
  if(firstAction.miniMaxValue > secondAction.miniMaxValue)return -1;
  else if(firstAction.miniMaxValue < secondAction.miniMaxValue)return 1;
  return 0;
}

function getScore(gamestate){
  switch (gamestate.state) {
    case 1:
      return gamestate.AImovesCount - 10;
    case 2:
      return 10 - gamestate.AImovesCount;
    default:
      return 0;

  }
}




function miniMax(gamestate){

  if(gamestate.checkState() != 0){
    return getScore(gamestate);
  }

  var stateScore = 0;

  if(gamestate.turn == 2){
    stateScore = -10000;
  }
  else stateScore = 10000;

  var availableMoves = getPossibleMoves(gamestate.board);

}

function indexOfMax(arr, min) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if(!min){
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
      }
      else {
        if (arr[i] < max) {
            maxIndex = i;
            max = arr[i];
        }
      }
    }

    return maxIndex;
}

function copyBoard(board){
  var newBoard = [];
  for(var x = 0; x < 3; x++){
    newBoard[x] = [];
    for(var y = 0; y < 3; y++){
      newBoard[x][y] = board[x][y];
    }
  }
  return newBoard;
}

function getPossibleMoves(board){
  moves = [];
  for(var dx = 0; dx < 3; dx++){
    for(var dy = 0; dy < 3; dy++){
      if(board[dx][dy] == 0){
        moves.push({x: dx, y: dy});
      }
    }
  }
  return moves;
}

var loadingTime = 0;

function drawLoading(depth){
  loadingTime++;
  clear();

  noStroke();
  fill(50);
  text("calculating move...", width/2, height/2);
  text(depth+" | "+loadingTime, width/2, height/2 + 30);
  ellipse(width/2, height/2 + 100, loadingTime%100);

}

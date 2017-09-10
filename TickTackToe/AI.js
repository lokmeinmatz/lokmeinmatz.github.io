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

function checkWinner(board){
  //horizontal
  for (var y = 0; y < 3; y++){
    if(board[0][y] == board[1][y] && board[1][y] == board[2][y] && board[0][y] != 0){
      return board[0][y];
    }
  }

  //vertical
  for (var x = 0; x < 3; x++){
    if(board[x][0] == board[x][1] && board[x][1] == board[x][2] && board[x][0] != 0){
      return board[x][0];
    }
  }

  //diagonal 1
  if(board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != 0){
    return board[0][0];
  }

  //diagonal 1
  if(board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != 0){
    return board[0][2];
  }

  //check if field is full
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      if(board[x][y] == 0){
        return 0;
      }
    }
  }

  return -1;

}


function miniMax(board){

  function Node(data){
    this.data = data;
    this.parent = null;
    this.children = [];
  }

  var rootdata = {
    board: board,
    score: 0,
    depth: 0,
    currentPlayer: 2,
  };

  var gamestate = checkWinner(board);
  if(gamestate != 0){
    if(gamestate == -1)rootdata.score =  0;
    else if(gamestate == 2)rootdata.score = 10;
    else if(gamestate == 1)rootdata.score = -10;
  }

  var root = new Node(rootdata);

  var current = root;

  while(current){
    //generate possible moves

    var availableMoves = getPossibleMoves(current.data.board);


  }

  return;




  scores = [];
  moves = [];



  for (var i = 0; i < availableMoves.length; i++) {
    var move = availableMoves[i];
    var mboard = copyBoard(oldBoard);
    mboard[move.x][move.y] = 2;
    scores.push(miniMax(mboard, (currentPlayer == 1)?2:1, depth));
    moves.push(move);
  }

  if(currentPlayer == 2){
    //max calculate
    //get index of highest score
    var max_index = indexOfMax(scores, false);
    choice = moves[max_index];
    return scores[max_index];
  }
  else{
    //min calculate
    //get index of lowest score
    var low_index = indexOfMax(scores, true);
    choice = moves[low_index];
    return scores[low_index];
  }


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

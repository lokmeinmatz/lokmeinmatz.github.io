const ENDSCREEN = 31323,
      PLAYING = 31231,
      MENU = 13123,
      CIRCLE = 1,
      CROSS = 2;

const lineColor = "#0da192";

var STATE = MENU;

var linelength = 0;



var playAgainstAI = false;
var AIdifficulty = DIFFICULTY_EASY;
var currentGameState = new GameState();

function GameState(old){
  this.turn = CIRCLE;
  this.AImovesCount = 0;
  this.state = 0;
  this.board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  if(old !== undefined){
    this.board = copyBoard(old.board);
    this.AImovesCount = old.AImovesCount;
    this.state = old.state;
    this.turn = old.turn;
  }

  this.advanceTurn = function() {
    this.turn = (this.turn == CIRCLE)? CROSS : CIRCLE;
  }

  this.checkState = function () {
    for (var y = 0; y < 3; y++){
      if(this.board[0][y] == this.board[1][y] && this.board[1][y] == this.board[2][y] && this.board[0][y] != 0){
        this.state = this.board[0][y];
        return this.board[0][y];
      }
    }

    //vertical
    for (var x = 0; x < 3; x++){
      if(this.board[x][0] == this.board[x][1] && this.board[x][1] == this.board[x][2] && this.board[x][0] != 0){
        this.state = this.board[x][0];
        return this.board[x][0];
      }
    }

    //diagonal 1
    if(this.board[0][0] == this.board[1][1] && this.board[1][1] == this.board[2][2] && this.board[0][0] != 0){
      this.state = this.board[0][0];
      return this.board[0][0];
    }

    //diagonal 1
    if(this.board[0][2] == this.board[1][1] && this.board[1][1] == this.board[2][0] && this.board[0][2] != 0){
      this.state = this.board[0][2];
      return this.board[0][2];
    }

    //check if field is full
    for(var x = 0; x < 3; x++){
      for(var y = 0; y < 3; y++){
        if(this.board[x][y] == 0){
          this.state = 0;
          return 0;
        }
      }
    }
    this.state = -1;
    return -1;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight - 1);
}
var mouseInTouch = false;
function draw() {
  clear();

  if(mouseInTouch){
    touches.splice(0, 1);
    mouseInTouch = false;
  }
  if(mouseIsPressed){
    mouseInTouch = true;
    touches[0] = ({x:mouseX, y:mouseY});
  }


  if(STATE == PLAYING){
    updateInputs();
    drawBorder();

    drawMap();
  }

  else if(STATE == ENDSCREEN){
    updateInputsEndScreen();
    drawEndScreen();
  }

  else if(STATE == MENU){
    updateInputsMenu();
    drawMenu();
  }

  if(currentGameState.state != 0){
    STATE = ENDSCREEN;
  }

}

var clickcounter = 0;

function updateInputs(){
  clickcounter++;
  var startX = (width -  linelength)/2;
  var startY = (height - linelength)/2;
  var cellSize = linelength/3;

  if(playAgainstAI && currentGameState.turn == CROSS){

    //do ai move
    var move = getAImove(currentGameState, AIdifficulty);
    console.log(move);
    if(currentGameState.board[move.x][move.y] == 0){
      currentGameState.board[move.x][move.y] = currentGameState.turn;

      currentGameState.advanceTurn();

      //check winner
      currentGameState.checkState();
    }
  }
  else{
    if (touches.length > 0 && clickcounter > 10) {
      clickcounter = 0;

      var pressed_cell_x = floor((touches[0].x - startX) / cellSize);
      var pressed_cell_y = floor((touches[0].y - startY) / cellSize);
       text(pressed_cell_x + " " + pressed_cell_y, 20, 20);
       if(pressed_cell_x < 0 || pressed_cell_y < 0 ||
          pressed_cell_x >= 3 || pressed_cell_y >= 3)
       {
            //outside of map
       }
       else{

         if(currentGameState.board[pressed_cell_x][pressed_cell_y] == 0){
           currentGameState.board[pressed_cell_x][pressed_cell_y] = currentGameState.turn;

           currentGameState.advanceTurn();

           //check winner
           currentGameState.checkState();
         }
      }
    }
  }
}


function updateInputsEndScreen(){
  if(touches.length > 0){
    if (touches[0].y > height - 70){
      //restart


      for(var x = 0; x < 3; x++){
        for(var y = 0; y < 3; y++){
          currentGameState = new GameState();
          STATE = MENU;
        }
      }
    }
  }
}

function drawEndScreen(){
  var cellSize = linelength/3;
  textSize(15);
  fill("white");
  noStroke();
  textAlign(CENTER);

  if(currentGameState.state > 0){
    text("Gratulation!", width/2, 70);
    text("Player", width/2, 150);

    //draw winner

    noFill();
    if(currentGameState.state == CIRCLE){
      stroke(242, 235, 211);
      ellipse(width/2, 200 + cellSize/2, cellSize*0.7);
    }
    else if(currentGameState.state == CROSS){
      stroke(84, 84, 84);
      var tempWidth = width/2 + cellSize/2;
      line(tempWidth - cellSize*0.2, 200 + cellSize* 0.2, tempWidth - cellSize*0.8, 200 + cellSize*0.8);
      line(tempWidth - cellSize*0.8, 200 + cellSize* 0.2, tempWidth - cellSize*0.2, 200 + cellSize*0.8);
    }

    fill("white");
    noStroke();
    textAlign(CENTER);
    text("won the game!", width/2, 200 + cellSize * 1.2);
  }

  else{
    textSize(30);
    text("Draw!",width/2, height/2);
    textSize(15);
  }


  //restart button
  rect(0, height - 70, width, height);

  fill("#14bdac");
  text("Back to menu", width/2, height - 30);

}



function drawCell(x, y, type, cellSize){
  var startX = (width -  linelength)/2 + x * (linelength/3);
  var startY = (height - linelength)/2 + y * (linelength/3);
  noFill();

  if (type == CIRCLE){

    stroke(242, 235, 211);
    ellipse(startX + cellSize/2, startY + cellSize/2, cellSize*0.7);
  }

  else if (type == CROSS){
    stroke(84, 84, 84);

    line(startX + cellSize*0.2, startY + cellSize* 0.2, startX + cellSize*0.8, startY + cellSize*0.8);
    line(startX + cellSize*0.8, startY + cellSize* 0.2, startX + cellSize*0.2, startY + cellSize*0.8);
  }

}

function drawMap(){
  noFill();
  for (var x = 0; x < 3; x++){
    for (var y = 0; y < 3; y++){
      drawCell(x, y, currentGameState.board[x][y], linelength/3);
    }
  }
}

function drawBorder(){
  stroke(lineColor)
  strokeWeight(5);
  //calculate line length
  linelength = 0;
  if (width < height){
      linelength = width * 0.8;
  }
  else{
    linelength = height * 0.8;
  }

  var startX = (width - linelength)/2;
  var startY = (height - linelength)/2;
  //top horizontal
  line(startX, startY + linelength/3, startX + linelength, startY + linelength/3);

  //bottom horizontal
  line(startX, startY + 2*linelength/3, startX + linelength, startY + 2*linelength/3);

  //left vertical
  line(startX + linelength/3, startY, startX + linelength/3, startY + linelength);

  //right vertical
  line(startX + 2*linelength/3, startY, startX + 2*linelength/3, startY + linelength);
}

var menuData = {
  targetOffsetX: 0,
  currentOffsetX: 0,
  mouseHoverAI: false,
  clickTimer: 10,
  mouseHoverPlay: false,

  targetDifficultyX: 0,
  currentDifficultyX: 0,

  startPlayerY: 0,
  playAgainstAIY: 0,
  difficultyY: 0,
};

function updateInputsMenu() {

  menuData.startPlayerY = height/5;
  menuData.playAgainstAIY = height/2;
  menuData.difficultyY = height/1.5;

  menuData.clickTimer--;
  if(touches.length > 0 && menuData.clickTimer < 0){
    menuData.clickTimer = 10;
    if(touches[0].y >= menuData.startPlayerY && touches[0].y <= menuData.startPlayerY + 100){
      //inside startplayer area
      if(touches[0].x < width/2)currentGameState.turn = CIRCLE;
      else {
        currentGameState.turn = CROSS;
      }

    }
    else if(touches[0].y >= menuData.playAgainstAIY && touches[0].y <= menuData.playAgainstAIY + 40 && touches[0].x >= width/2 - 20 && touches[0].x <= width/2 + 20)playAgainstAI = !playAgainstAI;
    else if(touches[0].y >= height - 90 && touches[0].y <= height - 30 && touches[0].x >= width/2 - 70 && touches[0].x <= width/2 + 70)STATE = PLAYING
    else if(touches[0].y >= menuData.difficultyY && touches[0].y <= menuData.difficultyY + 100){
      //inside difficulty area
      if(touches[0].x < width/2)AIdifficulty = DIFFICULTY_EASY;
      else {
        AIdifficulty = DIFFICULTY_HARD;
      }
    }

  }
  if(mouseY >= menuData.playAgainstAIY && mouseY <= menuData.playAgainstAIY + 40 && mouseX >= width/2 - 20 && mouseX <= width/2 + 20)menuData.mouseHoverAI = true;
  else {
    menuData.mouseHoverAI = false;
  }

  if(mouseY >= height - 90 && mouseY <= height - 30 && mouseX >= width/2 - 70 && mouseX <= width/2 + 70)menuData.mouseHoverPlay = true;
  else {
    menuData.mouseHoverPlay = false;
  }
}

function drawMenu() {
textAlign(CENTER);
  textSize((width + height) / 100);
  var s = "Do you want Cross or Circle to start?"
  fill(50);
  text(s, width/2, height/10);

  //draw starting or ai
  noStroke();


  menuData.targetOffsetX = (currentGameState.turn == CIRCLE)? 0 : width/2;
  menuData.currentOffsetX = lerp(menuData.currentOffsetX, menuData.targetOffsetX, 0.1);
  fill(250);
  rect(menuData.currentOffsetX, menuData.startPlayerY, width/2, 100);
  noFill();
  stroke(84, 84, 84);
  ellipse(width/4, menuData.startPlayerY + 50, 70);


  var startX = width / 4 * 3 - 50,
      startY = menuData.startPlayerY,
      cellSize = 100;
  line(startX + cellSize*0.2, startY + cellSize* 0.2, startX + cellSize*0.8, startY + cellSize*0.8);
  line(startX + cellSize*0.8, startY + cellSize* 0.2, startX + cellSize*0.2, startY + cellSize*0.8);


  //ai checkbox
  noStroke();
  fill(50);
  text("Play against AI (AI will be Cross) << Not working yet", width/2, height/2 - 20);

  stroke(50);
  strokeWeight(1);
  if(menuData.mouseHoverAI)strokeWeight(4);
  noFill();
  rect(width/2 - 20, menuData.playAgainstAIY, 40, 40);

  strokeWeight(4);
  if(playAgainstAI){
    //draw check
    line(width/2 - 15, menuData.playAgainstAIY + 20, width/2, menuData.playAgainstAIY + 35);
    line(width/2, menuData.playAgainstAIY + 35, width/2 + 25, menuData.playAgainstAIY + 5);
  }

  strokeWeight(1);
  noStroke();

  //difficulty
  menuData.targetDifficultyX = (AIdifficulty == DIFFICULTY_EASY)? 0 : width/2;
  menuData.currentDifficultyX = lerp(menuData.currentDifficultyX, menuData.targetDifficultyX, 0.1);
  fill(250);
  rect(menuData.currentDifficultyX, menuData.difficultyY, width/2, 100);
  fill(50);
  text("EASY", width/4, menuData.difficultyY + 55);
  text("HARD", width/4 * 3, menuData.difficultyY + 55);
  //play button
  noStroke();
  if(menuData.mouseHoverPlay)stroke(50);
  fill(230);
  rect(width/2 - 70, height - 90, 140, 60);
  fill(50);
  text("PLAY", width/2, height - 50);
}

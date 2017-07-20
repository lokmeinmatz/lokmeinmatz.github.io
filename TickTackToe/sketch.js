const ENDSCREEN = 31323,
      PLAYING = 31231,
      CIRCLE = 1,
      CROSS = 2;

const lineColor = "#0da192";

var STATE = PLAYING;

var linelength = 0;

var data = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];



function setup() {
  createCanvas(windowWidth, windowHeight - 1);
}

function draw() {
  clear();
  if(STATE == PLAYING){
    updateInputs();
    drawBorder();

    drawMap();
  }

  else if(STATE == ENDSCREEN){
    updateInputsEndScreen();
    drawEndScreen();
  }

  console.log(STATE);

  if(winner != 0){
    STATE = ENDSCREEN;
  }

}

var clickcounter = 0;
var currentPlayer = CIRCLE;
var winner = 0;

function updateInputs(){
  clickcounter++;
  var startX = (width -  linelength)/2;
  var startY = (height - linelength)/2;
  var cellSize = linelength/3;

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

       if(data[pressed_cell_x][pressed_cell_y] == 0){
         data[pressed_cell_x][pressed_cell_y] = currentPlayer;

         currentPlayer = (currentPlayer == CIRCLE)? CROSS : CIRCLE;

         //check winner
         winner = checkWinner();
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
          data[x][y] = 0;
          winner = 0;
          STATE = PLAYING;
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

  if(winner > 0){
    text("Herzlichen Glueckwunsch!", width/2, 70);
    text("Spieler", width/2, 150);

    //draw winner

    noFill();
    if(winner == CIRCLE){
      stroke(242, 235, 211);
      ellipse(width/2, 200 + cellSize/2, cellSize*0.7);
    }
    else if(winner == CROSS){
      stroke(84, 84, 84);
      var tempWidth = width/2 + cellSize/2;
      line(tempWidth - cellSize*0.2, 200 + cellSize* 0.2, tempWidth - cellSize*0.8, 200 + cellSize*0.8);
      line(tempWidth - cellSize*0.8, 200 + cellSize* 0.2, tempWidth - cellSize*0.2, 200 + cellSize*0.8);
    }

    fill("white");
    noStroke();
    textAlign(CENTER);
    text("hat gewonnen!", width/2, 200 + cellSize * 1.2);
  }

  else{
    textSize(30);
    text("Gleichstand!",width/2, height/2);
    textSize(15);
  }


  //restart button
  rect(0, height - 70, width, height);

  fill("#14bdac");
  text("Neues Spiel", width/2, height - 30);

}

function checkWinner(){
  //horizontal
  for (var y = 0; y < 3; y++){
    if(data[0][y] == data[1][y] && data[1][y] == data[2][y] && data[0][y] != 0){
      return data[0][y];
    }
  }

  //vertical
  for (var x = 0; x < 3; x++){
    if(data[x][0] == data[x][1] && data[x][1] == data[x][2] && data[x][0] != 0){
      return data[x][0];
    }
  }

  //diagonal 1
  if(data[0][0] == data[1][1] && data[1][1] == data[2][2] && data[0][0] != 0){
    return data[0][0];
  }

  //diagonal 1
  if(data[0][2] == data[1][1] && data[1][1] == data[2][0] && data[0][2] != 0){
    return data[0][2];
  }

  //check if field is full
  for(var x = 0; x < 3; x++){
    for(var y = 0; y < 3; y++){
      if(data[x][y] == 0){
        return 0;
      }
    }
  }

  return -1;

}

function drawCell(x, y, type){
  var startX = (width -  linelength)/2 + x * (linelength/3);
  var startY = (height - linelength)/2 + y * (linelength/3);
  var cellSize = linelength/3;

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
      drawCell(x, y, data[x][y]);
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



const bomb = -100;


var y_offset = 50;
const cell_spacing = 2; //*2

const f_width = 10, f_height = 8;
var difficulty = 10;
var bombcount = 0;
var CellsToDiscover = 0;
var cell_h = 100;
var cell_w = 100;
var field = new Array(f_width);
var rightclickcounter = 0;
var dead = false;

var xoffset = [0, 1, 1, 1, 0, -1, -1, -1];
var yoffset = [1, 1, 0, -1, -1, -1, 0, 1];



function unDiscover(x, y){
  if(field[x][y].discovered){
    return;
  }
  field[x][y].discovered = true;
  var fieldsToVisit = [];


  if(field[x][y].state == 0 ){


    fieldsToVisit.push({x: x, y:y})
  }
  else
  {
    return;
  }

  while(fieldsToVisit.length > 0)
  {
    var coords = fieldsToVisit.shift();


    field[coords.x][coords.y].discovered = true;

    if(field[coords.x][coords.y].state == 0 ){
      for(var i = 0; i < 8; i++){
        if(coords.x + xoffset[i] >= 0 && coords.x + xoffset[i] < f_width &&
          coords.y + yoffset[i] >= 0 && coords.y + yoffset[i] < f_height){
          if(field[coords.x][coords.y].state == 0 && !field[coords.x + xoffset[i]][coords.y + yoffset[i]].discovered)
          {
            fieldsToVisit.push({x: coords.x + xoffset[i], y: coords.y + yoffset[i]});
          }

        }
      }
    }

  }

}

function cell(){
  this.discovered = false;
  this.state = 0;
  this.flag = false;
}

function generateMap()
{

  for(var i = 0; i < f_width; i++){
    field[i] = new Array(f_height);

    for(var j = 0; j < f_height; j++){
      field[i][j] = new cell();
    }

  }
  //generate bombs
  bombcount = difficulty + int(random(3)) - 1;
  console.log("Bomben im Spiel: "+bombcount);
  for (var i = 0; i < bombcount; i++){
    while(true){
      var bombx = floor(random(f_width));
      var bomby = floor(random(f_height));

      if(field[bombx][bomby].state != bomb){
        field[bombx][bomby].state = bomb;
        break;
      }
    }
  }
  calcDistances();
}


function setup() {

  createCanvas(window.innerWidth - 5, window.innerHeight - 5);
  textSize(30);
  noStroke();

  generateMap();

  //calculate cell width
  cell_w = floor(width / f_width);
  cell_h = floor(height / f_height);

  calcCellsToDiscover();
}

var down = true;

function calcCellsToDiscover(){
  CellsToDiscover = 0;
  for(var x = 0; x < f_width; x++){
    for(var y = 0; y < f_height; y++){
      if(!field[x][y].discovered)CellsToDiscover++;
    }
  }
}

function draw() {
  fill("#f39c12");
  rect(0, 0, width, height);

  //remaining cells: all (f_width * f_height) - discoveredCells - bombcount;
  fill(255);
  text("Bombs: "+bombcount+" | remaining cells to discover: "+(CellsToDiscover - bombcount), 20, 20);

  if(dead)
  {
    if(y_offset < height && down)
    {
      y_offset += 20;
    }
    else if(y_offset >= height)
    {
      y_offset = -height;
      down = false;
      generateMap();
    }
    else if(y_offset < 50)
    {
      y_offset += 20;
    }
    else {
      y_offset = 50;
      dead = false;
      down = true;
    }


  }


  rightclickcounter++;


  if (mouseIsPressed) {

    //calculate pressed cell

    var pressed_cell_x = floor((mouseX)/ cell_w) ;
    var pressed_cell_y = floor((mouseY - y_offset) / cell_h);

    if(pressed_cell_x < 0 || pressed_cell_y < 0 ||
       pressed_cell_x >= f_width || pressed_cell_y >= f_height)
    {
         //outside of map
    }
    else
    {
      console.log(pressed_cell_x, pressed_cell_y, mouseButton);

      if (mouseButton == LEFT && !field[pressed_cell_x][pressed_cell_y].flag)
      {
        unDiscover(pressed_cell_x, pressed_cell_y);


        //discover others




        //death
        if(field[pressed_cell_x][pressed_cell_y].state == bomb)
        {
          dead = true;
        }


      }

      else if (mouseButton == RIGHT && !field[pressed_cell_x][pressed_cell_y].discovered)
      {
        if(rightclickcounter > 10)
        {
          field[pressed_cell_x][pressed_cell_y].flag = !field[pressed_cell_x][pressed_cell_y].flag;
          rightclickcounter = 0;
        }
      }
    }
    calcCellsToDiscover();

  }


  drawField();

}

function calcDistances()
{
  for(var x = 0; x < f_width; x++)
  {
    for(var y = 0; y < f_height; y++)
    {

      if(field[x][y].state != bomb)
      {
        //count next bombs




        for(var i = 0; i < 8; i++){

          if(x + xoffset[i] >= 0 && x + xoffset[i] < f_width &&
             y + yoffset[i] >= 0 && y + yoffset[i] <   f_height && field[x + xoffset[i]][y + yoffset[i]].state == bomb)
          {
            field[x][y].state += 1;
          }

        }


      }


    }
  }
}

function drawField(){
  //draw field
  for(var x = 0; x < f_width; x++)
  {
    for(var y = 0; y < f_height; y++)
    {

      if(!field[x][y].discovered){
        fill("#1abc9c");
        rect(x*cell_w + cell_spacing, (y*cell_h) + y_offset + cell_spacing, cell_w - cell_spacing * 2, cell_h - cell_spacing * 2);

        if(field[x][y].flag){
          fill("#3498db");
          ellipse(x * cell_w + (cell_w / 2), y * cell_h + (cell_h/2) + y_offset, 40, 40);
        }

      }
      else{
        if(field[x][y].state == bomb) {

          fill("#c0392b");
          rect(x*cell_w + cell_spacing, (y*cell_h) + y_offset + cell_spacing, cell_w - cell_spacing * 2, cell_h - cell_spacing * 2);
        }
        else if(field[x][y].state > 0)
        {
          fill("white");
          text(field[x][y].state, x * cell_w + (cell_w / 2), y * cell_h + (cell_h/2) + y_offset);
        }
      }
    }
  }
}

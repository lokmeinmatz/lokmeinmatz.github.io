const HEADING = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,

  getOffset: function (heading) {
    if(heading == HEADING.up)    return {x:  0, y: -1};
    if(heading == HEADING.left)  return {x: -1, y:  0};
    if(heading == HEADING.down)  return {x:  0, y:  1};
    if(heading == HEADING.right) return {x:  1, y:  0};
  }
}

let grid = [];
let snake = new Snake();
const grid_w = 20,
      grid_h = 20;
let cellSize = 10;
const food = -1;
for(let i = 0; i < grid_w; i++){
  grid.push([]);
  for(let j = 0; j < grid_h; j++){
    grid[i].push(0);
  }
}

function setup() {
  createCanvas(100, 100);
  cellSize = width / grid_w;
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  spawnRandomFood();
  noSmooth();
  ellipseMode(CORNER);
}

let speed = 10;
let timer = 0;

let currentFood = new Coord(-1, -1);

function spawnRandomFood(){

  do {

    currentFood = new Coord(floor(random(grid_w)), floor(random(grid_h)));

  } while (grid[currentFood.x][currentFood.y] != 0);
  grid[currentFood.x][currentFood.y] = food;
}

function draw() {

  //update inputs
  if(keyIsDown(UP_ARROW) && snake.lastHeading != HEADING.down){
    snake.heading = HEADING.up;
  }
  if(keyIsDown(RIGHT_ARROW) && snake.lastHeading != HEADING.left){
    snake.heading = HEADING.right;
  }
  if(keyIsDown(DOWN_ARROW) && snake.lastHeading != HEADING.up){
    snake.heading = HEADING.down;
  }
  if(keyIsDown(LEFT_ARROW) && snake.lastHeading != HEADING.right){
    snake.heading = HEADING.left;
  }


  background(5);
  timer++;
  if(timer >= speed){
    timer = 0;
    snake.moveSnake();
    snake.updateGrid();
  }

  drawGrid();
}

function clearGrid() {
  for(let i = 0; i < grid_w; i++){
    for(let j = 0; j < grid_h; j++){
      grid[i][j] = (grid[i][j] > 0)?0 : grid[i][j];
    }
  }
}

function Coord(x, y){
  this.x = x;
  this.y = y;

  this.isValid = function(){
    if(this.x < 0 || this.x >= grid_w || this.y < 0 || this.y >= grid_h)return false;
    return true;
  }
}



function Snake(){
  this.head = new Coord(10, 10);
  this.tail = [];
  this.tail.push(this.head);
  this.tail.push(new Coord(10, 9));
  this.heading = HEADING.right;
  this.lastHeading = HEADING.right;

  this.moveSnake = function() {
    let offset = HEADING.getOffset(this.heading);
    this.head = new Coord(this.head.x + offset.x, this.head.y + offset.y);
    if(!this.head.isValid() || grid[this.head.x][this.head.y] > 0){
      //lost

    }
    else{
      //check if ate food
      if(grid[this.head.x][this.head.y] == 0){
        this.tail.splice(this.tail.length - 1, 1);
      }
      else{
        spawnRandomFood();
      }
      this.tail.unshift(this.head);

      this.lastHeading = this.heading;
    }

  }


  this.updateGrid = function () {
    clearGrid();
    for(let i = 0; i < this.tail.length; i++){
      let coord = this.tail[i];
      grid[coord.x][coord.y] = i+1;
    }
  }
}


function drawGrid() {

  noStroke();
  colorMode(HSB);
  for(let x = 0; x < grid_w; x++){
    for(let y = 0; y < grid_h; y++){
      if(grid[x][y] > 0){
        //draw field
        //fill(200, 100, grid[x][y] * 10);

        fill(map(grid[x][y], 0, snake.tail.length, 0, 360), 50, 100);
        rect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
      }
      else if(grid[x][y] < 0){
        //Draw food
        fill(100, 100, 50);
        ellipse(x * cellSize, y * cellSize, cellSize - 1);
      }

    }
  }
  colorMode(RGB);

}

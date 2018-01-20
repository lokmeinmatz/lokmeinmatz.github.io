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

let restartTimer = 30

let grid
let snake

const grid_w = 10,
      grid_h = 10;
let cellSize = 10;
const food = -1;

let currentFood = new Coord(-1, -1);

function setup() {
  createCanvas(100, 100);
  cellSize = width / grid_w;
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  
  noSmooth();
  ellipseMode(CORNER);
  
  
  grid = []
  snake = new Snake()
  
  
  for(let i = 0; i < grid_w; i++){
  grid.push([]);
  for(let j = 0; j < grid_h; j++){
    grid[i].push(0);
  }
    
    spawnRandomFood();
    snake.path = getPath()
}
  
}

let speed = 10;
let timer = 0;


function spawnRandomFood(){

  do {

    currentFood = new Coord(floor(random(grid_w)), floor(random(grid_h)));

  } while (grid[currentFood.x][currentFood.y] != 0);
  //grid[currentFood.x][currentFood.y] = food;
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
  drawPath();


}

function clearGrid() {
  for(let i = 0; i < grid_w; i++){
    for(let j = 0; j < grid_h; j++){
      grid[i][j] = 0;
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
  this.head = new Coord(4, 3);
  this.tail = [];
  this.tail.push(this.head);
  this.tail.push(new Coord(4, 2));
  this.heading = HEADING.right;
  this.lastHeading = HEADING.right;
  this.path = undefined;
  this.useAI = true;

  this.moveSnake = function() {
    let offset = HEADING.getOffset(this.heading);

    this.head = new Coord(this.head.x + offset.x, this.head.y + offset.y);

    if(this.head.isValid() && (grid[this.head.x][this.head.y] <= 0 || grid[this.head.x][this.head.y] == this.tail.length)){
      //check if ate food
      if(grid[this.head.x][this.head.y] == 0 || grid[this.head.x][this.head.y] == this.tail.length){
        this.tail.splice(this.tail.length - 1, 1);
      }
      else{
        spawnRandomFood();
        //calculate new path
        snake.path = getPath();
      }


      this.tail.unshift(this.head);

      this.lastHeading = this.heading;

      if(this.useAI && this.path && this.path.length > 1){
        let currentNode = this.path[this.path.length-1];
        let nextNode = this.path[this.path.length-2];

        if(nextNode.x - currentNode.x == 1)this.heading = HEADING.right;
        if(nextNode.x - currentNode.x == -1)this.heading = HEADING.left;
        if(nextNode.y - currentNode.y == -1)this.heading = HEADING.up;
        if(nextNode.y - currentNode.y ==  1)this.heading = HEADING.down;
        this.path.splice(this.path.length-1, 1);
      }
    }
    else{
      //lost
      //countdown
      if(restartTimer > 0) {
        restartTimer-= 1
      }
      else {
        setup()
      }
      
    }

  }


  this.updateGrid = function () {
    clearGrid();
    for(let i = 0; i < this.tail.length; i++){
      let coord = this.tail[i];
      grid[coord.x][coord.y] = i+1;
    }
    grid[currentFood.x][currentFood.y] = food;
  }
}
function drawPath() {
  if(!snake.path)return;
  noStroke();
  fill(255, 255, 0);
  for(let i = 0; i < snake.path.length; i++){
    let coord = snake.path[i];
    rect(coord.x * cellSize + 2, coord.y * cellSize + 2, cellSize - 5, cellSize - 5);
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

        fill(map(grid[x][y], 0, snake.tail.length, 0, 360), (grid[x][y] == 1)?100:50, 100);
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

function Spot(x, y, timeUntilOpen) {
  this.x = x;
  this.y = y;
  this.f = Infinity;
  this.g = 0;
  this.h = Infinity;
  this.closed = false;
  this.neighbours = [];
  this.timeUntilOpen = (timeUntilOpen > 0)?timeUntilOpen:0;
  this.equals = function (other) {
    return (this.x == other.x && this.y == other.y);
  }
}

function heuristics(spot, target) {
  return Math.abs(target.x - spot.x) + Math.abs(target.y - spot.y);
}

function getPath(){

  let nodes = [];


  for(let i = 0; i < grid_w; i++){
    nodes.push([]);
    for(let j = 0; j < grid_h; j++){
      nodes[i].push(new Spot(i, j, (grid[i][j] <= 0)?0:snake.tail.length - grid[i][j]));

    }
  }

  let start = nodes[snake.head.x][snake.head.y];
  let end = nodes[currentFood.x][currentFood.y];


  for(let x = 0; x < grid_w; x++){
    for(let y = 0; y < grid_h; y++){
      nodes[x][y].h = heuristics(nodes[x][y], end);


      if(y > 0)nodes[x][y].neighbours.push(nodes[x][y-1]);
      if(y < grid_h - 1)nodes[x][y].neighbours.push(nodes[x][y+1]);
      if(x > 0)nodes[x][y].neighbours.push(nodes[x-1][y]);
      if(x < grid_w - 1)nodes[x][y].neighbours.push(nodes[x+1][y]);
    }
  }


  start.f = start.h;

  let openSet = [];
  openSet.push(start);

  while(openSet.length > 0){
    openSet.sort((a, b) => a.f - b.f);
    let current = openSet[0];

    if(current.equals(end)){
      console.log("Done");
      //todo return path
      let finalPath = [];
      finalPath.push(new Coord(current.x, current.y));
      while(current.previous){
        finalPath.push(new Coord(current.previous.x, current.previous.y));
        current = current.previous;
      }

      return finalPath;
    }
    openSet.splice(0, 1);
    current.closed = true;

    for(let i = 0; i < current.neighbours.length; i++){
      let neighbour = current.neighbours[i];

      //or neighbour is still tail
      if(neighbour.closed || neighbour.timeUntilOpen > current.g)continue;

      let temp_g = current.g + 1;

      if(!openSet.includes(neighbour))openSet.push(neighbour);
      else if(temp_g >= neighbour.g)continue;

      neighbour.g = temp_g;



      neighbour.f = neighbour.g + neighbour.h;
      neighbour.previous = current;
    }

  }

  console.log("No path found");
  return;

}

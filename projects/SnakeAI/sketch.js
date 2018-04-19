let snakes = []

let popCounter = 0
let history = []
let drawInfos = false

let SPEED = 1;


let mutationRate = 1.0
let mutationFactor = 10

let bestSnake = null

function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);

  frameRate(1)
  
  createPopulation(100)
}

const CELLSIZE = 50

function createPopulation(size) {
  snakes = []
  for(let i = 0; i < size; i++) {
    snakes[i] = new Snake(3, 3)

  }
}

function allSnakesDead() {
  for(let i = 0; i < snakes.length; i++) {
    if(!snakes[i].collided){
      return false
    }

  }
  return true
}

class PopulationInfo {
  constructor(id, bestOverAll, bestThisRound, Avg, Worst) {
    this.ID = id
    this.bestOverAll = bestOverAll
    this.bestThisRound = bestThisRound
    this.Avg = Avg
    this.Worst = Worst
  }
}

function newPopulation() {
  let totalFitness = 0
  let fitnessmap = []
  let best = snakes[0]
  let second = snakes[1]
  let worstL = best.body.length
  let totalL = 0
  for(let i = 0; i < snakes.length; i++) {
    if(snakes[i].body.length > best.body.length) {
      second = best
      best = snakes[i]
    }
    totalFitness += snakes[i].body.length
    fitnessmap.push({fitness:totalFitness, snake:snakes[i]})

    if(snakes[i].body.length < worstL) {
      worstL = snakes[i].body.length
    }
    totalL += snakes[i].body.length
  }
  if(!bestSnake) {
    bestSnake = best.copy()
  }
  if(best.body.length > bestSnake.body.length) {
    bestSnake = best.copy()
  }

  let statsBOA = bestSnake.body.length
  let statsBTR = best.body.length
  let Avg = totalL / snakes.length
  let popInfo = new PopulationInfo(popCounter, statsBOA, statsBTR, Avg, worstL)
  history.push(popInfo)

  let popSize = snakes.length
  //create new population, clone and mutate car
  snakes = []
  //if(popCounter % 20 == 0) mutationFactor *= 0.5  
  let currentMutRate = mutationFactor / (best.body.length + 0.1)
  mutationRate += currentMutRate
  mutationRate /= 2
  console.log("Randomizing by " + mutationRate.toString())
  for(let i = 0; i < popSize*2/3; i++) {
    snakes[i] = best.copy()
    snakes[i].reset(3, 3)
    snakes[i].brain.randomize(mutationRate)
  }
  while(snakes.length < popSize - 2) {
    let randVal = Math.random() * totalFitness
    let snake = fitnessmap[fitnessmap.length-1].snake

    for(let i = 0; i < fitnessmap.length-1; i++) {
      if(fitnessmap[i+1].fitness >= randVal) {
        snake = fitnessmap[i].snake
      }
    }

    let nsnake = snake.copy()
    nsnake.reset(3, 3)
    nsnake.brain.randomize(mutationRate)
    snakes.push(nsnake)
  }
  snakes.push(best.copy())
  snakes.push(second.copy())
  snakes[snakes.length - 2].reset(3, 3)
  snakes[snakes.length - 1].reset(3, 3)

  popCounter++
}


function draw() {
  background(0);
  //calculate lamp pos
  
  //let mouse = createVector(1200, 500);
  //Draw startV
  stroke(255)
  
  
  for(let upf = 0; upf < SPEED; upf++) {
    for(let snake of snakes) {
      snake.updatePhysics()
      
  
    }
  
    popCounter++
  
    if(popCounter > 300 || allSnakesDead()) {
      //new gen
      popCounter = 0
      newPopulation()
    }
  }

  fill(30)
  rect(0, 0, CELLSIZE*MAPWIDTH, CELLSIZE*MAPHEIGHT)
  
  for(let snake of snakes) {
    snake.draw()
  }

  //UI
  fill(255)
  noStroke()
  textSize(20)
  text(popCounter.toString(), 15, 15)
  text(frameRate().toFixed(2).toString(), 15, 40)
  if(bestSnake)text("Best car distance travelled: "+bestSnake.body.length.toFixed(2).toString(), 15, 100)

  if(drawInfos && history.length > 1) {
    fill(255, 255, 255, 100)
    rect(10, 10, width-10, height-10)
    for(let i = 0; i < history.length-1; i++) {
      let dataCur = history[i]
      let dataNxt = history[i+1]
      let x1 = map(i, 0, history.length, 100, width-100)
      let x2 = map(i+1, 0, history.length, 100, width-100)
      //Draw boa
      stroke(0, 255, 100)
      line(x1, map(dataCur.bestOverAll, 0, maxHeight, height-100, 100), x2, map(dataNxt.bestOverAll, 0, maxHeight, height-100, 100))
      
      //Draw btr
      stroke(0, 100, 255)
      line(x1, map(dataCur.bestThisRound, 0, maxHeight, height-100, 100), x2, map(dataNxt.bestThisRound, 0, maxHeight, height-100, 100))
      
      //Draw avg
      stroke(200, 150, 100)
      line(x1, map(dataCur.Avg, 0, maxHeight, height-100, 100), x2, map(dataNxt.Avg, 0, maxHeight, height-100, 100))
      
      //Draw Worst
      stroke(255, 0, 0)
      line(x1, map(dataCur.Worst, 0, maxHeight, height-100, 100), x2, map(dataNxt.Worst, 0, maxHeight, height-100, 100))
    }
  }
}

let maxHeight = 10
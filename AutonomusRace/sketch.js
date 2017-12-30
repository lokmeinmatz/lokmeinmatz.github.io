let track,
    startVs,
    startVavg,
    cars

let popCounter = 0
let history = []
let drawInfos = true

let SPEED = 3;
let trailMap;

let mutationRate = 1.0
let mutationFactor = 100

let bestCar = null

function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);

  generateTrack()
  
  cars = []
  createPopulation(30)
  trailMap = createImage(width, height) 
}

function generateTrack() {
  //create Track
    
  let pts = [];
  let edges = [];
  let centerV = createVector(width/2, height/2)
  for(let i = 0; i < 20; i++) {
    let r = random(height/2 - 150, height/2 - 50)
    //let r = 300
    let baseV = p5.Vector.fromAngle(map(i, 0, 20, 0, TWO_PI));

    let innerV = baseV.copy().mult(r - 40).add(centerV)
    let outerV = baseV.copy().mult(r + 40).add(centerV)
        if(i == 0){
          startVs = [innerV, outerV]
        }
    pts.push(innerV)
    pts.push(outerV)
    //connect last two inner points
    edges.push([i*2 - 2, i*2])
    
    //connect last two outer points
    edges.push([i*2 - 1, i*2 + 1])
  }
  edges[0][0] = pts.length - 2
  edges[1][0] = pts.length - 1

  track = new Mesh(pts, edges, color(255, 50, 0));

  startVavg = startVs[0].copy().add(startVs[1]).div(2)
}

function createPopulation(size) {
  cars = []
  for(let i = 0; i < size; i++) {
    cars[i] = new Car(startVavg.copy())

  }
}

function allCarsDead() {
  for(let i = 0; i < cars.length; i++) {
    if(!cars[i].collided){
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
  let best = cars[0]
  let second = cars[1]
  let worstDist = best.distTravelled
  let totalDist = 0
  for(let i = 0; i < cars.length; i++) {
    if(cars[i].distTravelled > best.distTravelled) {
      second = best
      best = cars[i]
    }
    if(cars[i].distTravelled < worstDist) {
      worstDist = cars[i].distTravelled
    }
    totalDist += cars[i].distTravelled
  }
  if(!bestCar) {
    bestCar = best.copy()
  }
  if(best.distTravelled > bestCar.distTravelled) {
    bestCar = best.copy()
  }

  let statsBOA = bestCar.distTravelled
  let statsBTR = best.distTravelled
  let Avg = totalDist / cars.length
  let popInfo = new PopulationInfo(popCounter, statsBOA, statsBTR, Avg, worstDist)
  history.push(popInfo)

  let popSize = cars.length
  //create new population, clone and mutate car
  cars = []
  if(popCounter % 20) mutationFactor *= 0.5  
  let currentMutRate = mutationFactor / (best.distTravelled + 0.1)
  mutationRate += currentMutRate
  mutationRate /= 2
  console.log("Randomizing by " + mutationRate.toString())
  for(let i = 0; i < popSize*2/3; i++) {
    cars[i] = best.copy()
    cars[i].reset(startVavg)
    cars[i].brain.randomize(mutationRate)
  }
  while(cars.length < popSize - 2) {
    let ncar = second.copy()
    ncar.reset(startVavg)
    ncar.brain.randomize(mutationRate * 2)
    cars.push(ncar)
  }
  cars.push(best.copy())
  cars.push(second.copy())
  cars[cars.length - 2].reset(startVavg)
  cars[cars.length - 1].reset(startVavg)

  popCounter++
}


function draw() {
  background(0);
  //calculate lamp pos
  
  //let mouse = createVector(1200, 500);
  //Draw startV
  stroke(255)
  line(startVs[0].x, startVs[0].y, startVs[1].x, startVs[1].y)
  
  track.draw()
  trailMap.loadPixels()
  for(let upf = 0; upf < SPEED; upf++) {
    for(let car of cars) {
      car.updatePhysics()
      
  
    }
  
    popCounter++
  
    if(popCounter > 1500 || allCarsDead()) {
      //new gen
      popCounter = 0
      generateTrack()
      newPopulation()
      trailMap.pixels.fill(0)
    }
  }
  trailMap.updatePixels()
  image(trailMap, 0, 0)
  for(let car of cars) {
    car.draw()
  }

  //UI
  fill(255)
  noStroke()
  textSize(20)
  text(popCounter.toString(), 15, 15)
  text(frameRate().toFixed(2).toString(), 15, 40)
  if(bestCar)text("Best car distance travelled: "+bestCar.distTravelled.toFixed(2).toString(), 15, 100)

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
      line(x1, map(dataCur.bestOverAll, 0, 8000, height-100, 100), x2, map(dataNxt.bestOverAll, 0, 8000, height-100, 100))

      //Draw btr
      stroke(0, 100, 255)
      line(x1, map(dataCur.bestThisRound, 0, 8000, height-100, 100), x2, map(dataNxt.bestThisRound, 0, 8000, height-100, 100))

      //Draw avg
      stroke(200, 150, 100)
      line(x1, map(dataCur.Avg, 0, 8000, height-100, 100), x2, map(dataNxt.Avg, 0, 8000, height-100, 100))

      //Draw Worst
      stroke(255, 0, 0)
      line(x1, map(dataCur.Worst, 0, 8000, height-100, 100), x2, map(dataNxt.Worst, 0, 8000, height-100, 100))
    }
  }
}

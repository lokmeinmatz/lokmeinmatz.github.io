let currentGraphic = null
let netInput = null
let drawInfos = false
let clickCoolDown = 20
let nets = []
let newDrawn = true
const POPsize = 50
let autoTrain = false

let mutRate = 0.01

let lastData = {fitness: 0.0, mutRate: 0.01}

function setup() {
  createCanvas(1800, 900);
  background(50)
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);
  currentGraphic = createGraphics(280, 280)
  currentGraphic.background(255)

  netInput = createGraphics(280, 280)
  netInput.background(255)
  reset()
}

function drawRandom() {
  currentGraphic.textSize(290 + random(20))
  let rnum = Math.floor(random(10))
  currentGraphic.text(rnum.toString(), 50 + random(30), 220 + random(30))
  let res = evaluateAll(rnum)
  guess = res[0]
  dist = res[1]
  reset(nets)
}

function reset(oldNets) {

  if(!oldNets) {
    nets = []
    for(let i = 0; i < POPsize; i++) {
      nets.push(new Network([784, 300, 30, 10]))
    }
  }
  else {
    nets = []
    let totalFitness = oldNets.reduce((total, current) => total + current.fitness, 0)
    mutRate = 1 / (totalFitness + 5)
    console.log(totalFitness)
    lastData.fitness = totalFitness
    lastData.mutRate = mutRate
    for(let i = 0; i < POPsize; i++) {
      let rValue = random(totalFitness)
      let winnerIndex = -1
      while(rValue > 0 && winnerIndex < POPsize - 1) {
        winnerIndex ++
        rValue -= oldNets[winnerIndex].fitness
      }
      if(winnerIndex < 0)winnerIndex = 0

      let newNet = oldNets[winnerIndex].copy()
      if(random(100) < 95)newNet.randomize(mutRate)
      else newNet.randomize(0.5)
      nets.push(newNet)
    }
    nets[0] = new Network([784, 300, 30, 10])
    

    
  }


  currentGraphic.background(255)
}

function evaluateAll(target) {

  //Create input
  let input = []
  currentGraphic.loadPixels()
  for(let x = 0; x < 280; x+= 10) {
    for(let y = 0; y < 280; y+= 10) {
      //get pixel avg, set to input
      let res = 0.0

      for(let dx = x; dx < x + 10; dx++) {
        for(let dy = y; dy < y + 10; dy++) {
          res += currentGraphic.pixels[(dx + dy * 280) * 4]
        }
      }
      res /= 100 * 255

      input.push(res)
    }
  }
  currentGraphic.updatePixels()

  //draw input
  netInput.noStroke()
  
  for(let x = 0; x < 28; x++) {
    for(let y = 0; y < 28; y++) {
      //console.log(input)
      netInput.fill(input[x + y * 28] * 255)
      netInput.rect( y * 10, x * 10, 10, 10)
    }
  }

  //returns most guessed number
  let totalOut = []
  for(let i = 0; i < 10; i++) {totalOut.push(0.0)}
  for(let net of nets) {
    let out = net.process(input)
    //for fitness: get guess
    let hightest = 0
    let hightestIndex = 0
    for(let i = 0; i < 10; i++) {
      totalOut[i] += out[i]

      if(out[i] > hightest) {
        hightest = out[i]
        hightestIndex = i
      }
    }

    if(target) {
      
      net.fitness = out[target]
      
      
    }
  }
  //console.log(totalOut)
  //get highest index of totalOut
  let highest = 0
  let hightestIndex = 0
  for(let i = 0; i < totalOut.length; i++) {
    if(totalOut[i] > highest) {
      highest = totalOut[i]
      hightestIndex = i
    }
  }

  return [hightestIndex, totalOut]
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
let guess = 0
let dist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

function draw() {

  if(autoTrain && clickCoolDown < 0) {
    drawRandom()
    clickCoolDown = 20
  }

  clickCoolDown --
  background(50)
  //Draw painting rect
  stroke(0)
  fill(255)
  rect(20, 20, 280, 280)
  image(currentGraphic, 20, 20)
  image(netInput, 20, 320)
  if(mouseIsPressed && mouseButton == LEFT) {
    if(mouseX > 20 && mouseX < 300) {
      if(mouseY > 20 && mouseY < 300) {
        currentGraphic.fill(0)
        currentGraphic.ellipse(mouseX - 20, mouseY - 20, 20)
        newDrawn = true
      }
    }
  }
  else if(newDrawn) {
      let res = evaluateAll()
      guess = res[0]
      dist = res[1]
      newDrawn = false
  }
  

  fill(255)
  textSize(30)
  strokeWeight(1)
  noStroke()

  
  text("Guess: "+guess.toString(), 320, 160)

  text("Right number:", 500, 160)


  text("Fitness: "+lastData.fitness.toFixed(3)+"  MutRate: "+lastData.mutRate.toFixed(3), 320, 400)

  const nSize = 60
  for(let i = 0; i < 10; i++) {
    let tlx = 700 + i * nSize
    if(mouseX > tlx && mouseX < tlx + nSize && mouseY > 120 && mouseY < 120 + nSize) {
      
      //hover
      stroke(0, 255, 30)
      fill(255)
      rect(tlx, 120, nSize, nSize)
      fill(20)

      if(mouseIsPressed && mouseButton == LEFT && clickCoolDown <= 0) {
        //clicked
        clickCoolDown = 20
        let res = evaluateAll(i)
        guess = res[0]
        dist = res[1]
        reset(nets)
      }
    }
    else {
      //no hover
      stroke(100)
      fill(20)
      rect(tlx, 120, nSize, nSize)
      fill(255)
    }
    noStroke()
    
    text(i.toString(), tlx + nSize*0.4, 160)


    rect(tlx, 120+nSize, nSize, dist[i]*5)
  }
  
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

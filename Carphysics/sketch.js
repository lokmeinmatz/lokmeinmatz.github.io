let ground = 900
let gravity = 0.1
let friction = 0.002
let dt = 0

let iterations = 10

function distance(p1, p2) {
  return p5.Vector.dist(p1.pos, p2.pos)
}


class Point {
  constructor(start, bouncyness) {
    this.pos = start.copy()
    this.oldP = start.copy()
    this.bouncyness = bouncyness
  }


  update() {
    let vx = (this.pos.x - this.oldP.x) * (1 - friction)
    let vy = (this.pos.y - this.oldP.y) * (1 - friction)

    this.oldP = this.pos.copy()
    this.pos.x += vx
    this.pos.y += vy + gravity

    
  }

  constrain() {
    let vx = (this.pos.x - this.oldP.x) * (1 - friction)
    let vy = (this.pos.y - this.oldP.y) * (1 - friction)
    if(this.pos.y > ground) {
      this.pos.y = ground
      this.oldP.y = this.pos.y + vy * this.bouncyness

      //reduce x-movement
      this.oldP.x += vx * 0.01
    }
  }

  draw() {
    stroke(0)
    strokeWeight(5)
    point(this.pos.x, this.pos.y)
  }
}

class Stick {
  constructor(p1, p2, stiffness) {
    this.p1 = p1
    this.p2 = p2
    this.length = distance(p1, p2)
    this.stiffness = stiffness
  }

  update() {
    let delta = p5.Vector.sub(this.p2.pos, this.p1.pos)
    let currDist = distance(this.p1, this.p2)
    let diff = this.length - currDist
    let perc = diff / currDist / (2 * iterations)
    //let perc = diff / currDist / 2
    let offset = delta.copy().mult(perc * this.stiffness)
    
    this.p1.pos.sub(offset)
    this.p2.pos.add(offset)
  }
  draw() {
    stroke(0)
    strokeWeight(1) 
    line(this.p1.pos.x, this.p1.pos.y, this.p2.pos.x, this.p2.pos.y)
  }
}


class Tire {
  constructor(center, r, segments) {
    //add points
    //add center
    points.push(new Point(center.copy(), 0.9))
    this.center = points[points.length - 1]
    //add circle

    this.rimpoints = []
    for(let i = 0; i < segments; i++) {
      let angle = map(i, 0, segments, 0, 360)
      let dir = createVector(r, 0).rotate(angle)
      let pt = new Point(center.copy().add(dir), 0.8)
      pt.stdAngle = angle
      points.push(pt)
      this.rimpoints.push(pt)
    }

    //create connections
    for(let i = 0; i < segments; i++) {
      let ni = points.length - segments + i
      //block - center
      sticks.push(new Stick(this.center, points[ni], 0.9))

      //block - next block
      sticks.push(new Stick(points[ni], points[(ni+1 < points.length) ? ni+1 : points.length - segments], 0.9))
    }
  }


  addTorque(amount) {
    for(let pt of this.rimpoints) {
      //forward : right -> clockwise

      let dirAng =  this.center.pos.copy().sub(pt.pos).heading() + 90//get angle between center and point
      let dirV = createVector(amount, 0).rotate(dirAng)
      pt.pos.add(dirV)

    }
  }
}


let points = []

let sticks = []

let tire
function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);



  tire = new Tire(createVector(width/2, height/2), 50, 20)
}

//let grabbedPoint
let grabbedPoint = null

let lastFrameMouse = false

function draw() {


  let highlighted = null
  for(let pt of points) {
    if(p5.Vector.dist(pt.pos, createVector(mouseX, mouseY)) < 10) {
      highlighted = pt
    }
  }

  //new click
  if(mouseIsPressed) {
    if(!lastFrameMouse) {
      //new click
      grabbedPoint = highlighted
    }

  }
  else {
    grabbedPoint = null
  }

  lastFrameMouse = mouseIsPressed

  background(100, 150, 255);
  //draw floor
  stroke(255)
  line(0, ground, width, ground)
  for(let point of points) {
    point.update()
  }

  if(grabbedPoint) {
    grabbedPoint.pos = createVector(mouseX, mouseY)
  }

  for(let i = 0; i < iterations; i++) {
    for(let stick of sticks) {
      stick.update()
    }
  
    for(let point of points) {
      point.constrain()
    }
  }
  

  for(let point of points) {
    point.draw()
  }

  

  for(let stick of sticks) {
    stick.draw()
  }

  //draw highlighted
  //draw grabbed
  if(grabbedPoint) {
    noStroke()
    fill(50, 255, 0)
    ellipse(grabbedPoint.pos.x, grabbedPoint.pos.y, 10)
  }
  else if(highlighted) {
    noStroke()
    fill(250, 200, 0)
    ellipse(highlighted.pos.x, highlighted.pos.y, 10)
  }

  

  //UI
  fill(255)
  noStroke()
  textSize(20)

  text(frameRate().toFixed(2).toString(), 15, 40)
  if(frameRate() > 1 && frameRate() < 200) {
    dt = 1 / frameRate()
  }

}

let firePoints = []
let flames = []
let nextID = 0
const NSIZE = 0.05
class Point {
  constructor(x, y, id) {
    this.x = x
    this.y = y
    this.id = id
    this.vx = noise((this.x+this.id)*NSIZE, (this.y-this.id)*NSIZE, frameCount*NSIZE)-0.5
    this.vy = noise((this.x-this.id)*NSIZE, (this.y+this.id)*NSIZE, frameCount*NSIZE)-1
    this.references = 1
  }

  update() {
    this.references = 0
    this.x += this.vx * 2
    this.y += this.vy * 2

    this.vx = noise((this.x+this.id)*NSIZE, (this.y-this.id)*NSIZE, frameCount*NSIZE)-0.5
    this.vy = noise((this.x-this.id)*NSIZE, (this.y+this.id)*NSIZE, frameCount*NSIZE)-1
  }
}

class Flame {
  constructor(p1, p2, p3) {
    this.vert_IDs = [p1, p2, p3]
    this.brightness = random(200, 255)
    colorMode(HSB)
    this.color = color(random(50), random(80, 100), 100)
    colorMode(RGB)
  }

  update() {

    this.brightness -= random(3)

  }

  draw() {
    fill(this.color._getRed(), this.color._getGreen(), this.color._getBlue(), this.brightness)

    beginShape()
    for(let i = 0; i < 3; i++) {
      let v = this.vert_IDs[i]
      let pt = firePoints[v]
      if(pt) {
        pt.references++
        vertex(pt.x, pt.y)
      }
      
    }
    endShape()
  }
}

function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);
 
  console.log("Started")


  
}


function draw() {
  dt = 1 / frameRate()
  background(0);
  if(mouseIsPressed) {
    for(let i = 0; i < 1; i++) {
      firePoints.push(new Point(mouseX, mouseY, nextID++))
    }
    while(firePoints.length < 3) {
      firePoints.push(new Point(mouseX, mouseY, nextID++))
    }
    flames.push(new Flame(firePoints.length-3, firePoints.length-2, firePoints.length-1))
    console.log("new Flame!")
  }

  for(let i = 0; i < firePoints.length; i++) {
    firePoints[i].update()
  }

  for(let i = 0; i < flames.length; i++) {
    let flame = flames[i]
    

    flame.update()

    
    flame.draw()

    if(flame.brightness < 2) {
      flames.splice(i, 1)
      i--
    }
    
  }

  
  
  
  for(let i = 0; i < firePoints.length; i++) {
    if(firePoints[i].references < 1) {
      console.log("removing", i)
      firePoints.splice(i, 1)
      i--
    }
  }
  
  
  //UI
  fill(255)
  noStroke()
  textSize(20)
  
  
}

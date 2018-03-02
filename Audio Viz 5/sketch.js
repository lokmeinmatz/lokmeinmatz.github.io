function updateCanvasScale() {
  let canvasRatio = canvas.width / canvas.height
  let screenRatio = window.innerWidth / window.innerHeight
  
  let canvasstyle = canvas.canvas.style;
  console.log(canvas)
  if(canvasRatio < screenRatio) {
    canvasstyle.height = "100vh";
    canvasstyle.width = "auto";
    console.log("height max")
  }
  else {
    canvasstyle.width = "100vw";
    canvasstyle.height = "auto";
    console.log("width max")
  }

}

let canvas


let root

class Branch {
  constructor(previous, angle, depth, angleVar) {
    this.base = previous.top
    this.length = previous.length * 0.75
    this.top = this.base.copy()
    this.top.add(p5.Vector.fromAngle(angle).mult(this.length))
    this.depth = depth
    if(depth < 8) {
      this.left = new Branch(this, angle + angleVar*1, depth+1, angleVar) 
      this.right = new Branch(this, angle - angleVar*1, depth+1, angleVar) 
    }
  }

  draw() {
    stroke(this.depth*5, 255 - this.depth*5,250)
    line(this.base.x, this.base.y, this.top.x, this.top.y)
    if(this.left) this.left.draw()
    if(this.right) this.right.draw()
  }
}
let time = 0.0
function setup() {
  canvas = createCanvas(1800, 1000);
  updateCanvasScale()
  angleMode(DEGREES);
  console.log("Starting program...");
  
  root = new Branch({top:createVector(width/2, height-50), length:400}, PI*1.5, 0, time)
  
}

function draw() {
  colorMode(RGB);
  background(100);
  colorMode(HSB);
  stroke(255)
  strokeWeight(3)
  time += 0.01
  root = new Branch({top:createVector(width/2, height-50), length:400}, PI*1.5, 0, time)
  root.draw()

 
}

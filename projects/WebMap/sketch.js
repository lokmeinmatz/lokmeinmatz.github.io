
let rawData

function preload() {
  rawData = loadStrings("scraped.map")
}

let nodes = []
let edges = []

const minEdgeLength = 4

class Node {
  constructor(URL) {
    this.URL = URL
    this.pos = createVector(random(width), random(height))
    this.vel = createVector(0, 0)
    this.size = 1
  }

  update() {
    this.pos.add(this.vel)
    this.vel.x *= 0.8
    this.vel.y *= 0.8
  }

  getD() {
    return Math.sqrt(this.size) * 10
  }

  draw() {
    noStroke()
    fill(255, 100, 0)
    const d = this.getD()
    ellipse(this.pos.x, this.pos.y, d)
  }

  drawData() {
    fill(100, 10, 0)
    const tWidth = textWidth(this.URL) + 10

    rect(this.pos.x - tWidth * 0.5, this.pos.y - 15, tWidth, 20)

    fill(255)
    textAlign(CENTER)
    text(this.URL, this.pos.x, this.pos.y)
  }
}

class Edge {
  constructor(startID, endID) {
    this.a = startID
    this.b = endID
    //this.counts = 1
  }

  draw() {
    const n1 = nodes[this.a]
    const n2 = nodes[this.b]

    stroke(255)
    line(n1.pos.x, n1.pos.y, n2.pos.x, n2.pos.y)
  }

  update() {
    const n1 = nodes[this.a]
    const n2 = nodes[this.b]
    let factor = 0.1
    if(n1.pos.dist(n2.pos) < minEdgeLength * (n1.getD() + n2.getD())) factor *= -1

    const vec = p5.Vector.sub(n1.pos, n2.pos).normalize().mult(factor / (n1.size + n2.size))
    
    n1.vel.sub(vec) 
    n2.vel.add(vec)
    

  }
}

function getIndex(URL) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].URL == URL) return i
  }
  return -1
}

function setup() {
  createCanvas(2000, 1000)
  windowResized()

  //create map
  for (let dir of rawData) {
    const row = dir.split(" ")
    let start = row[0]
    let startI = getIndex(start)
    if (startI < 0) {
      nodes.push(new Node(start))
      startI = nodes.length - 1
    }
    else {
      nodes[startI].size++
    }


    for (let i = 1; i < row.length; i++) {
      let pURL = row[i]
      let endI = getIndex(pURL)
      if (endI < 0) {
        nodes.push(new Node(pURL))
        endI = nodes.length - 1
      }
      else {
        nodes[endI].size++
      }

      edges.push(new Edge(startI, endI))
    }
  }
}



function draw() {
  background(20)

  for (let edge of edges) {
    edge.draw()
    edge.update()
  }
  const mVec = createVector(mouseX, mouseY)
  const BorderCollision = true
  
  for (let node of nodes) {
    node.update()
    node.draw()

    if (node.pos.dist(mVec) < node.getD()) {
      node.drawData()
    }

    if (BorderCollision) {
      const n1D = node.getD()
      if (node.pos.x < 0.5 * n1D) node.vel.x += 1
      if (node.pos.x > width - 0.5 * n1D) node.vel.x -= 1

      if (node.pos.y < 0.5 * n1D) node.vel.y += 1
      if (node.pos.y > height - 0.5 * n1D) node.vel.y -= 1
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i]
      const n2 = nodes[j]
      const dis = n1.pos.dist(n2.pos)

      const force = (1 / (dis + 10)) * (n1.getD() + n2.getD())


      let toV = p5.Vector.sub(n1.pos, n2.pos)
      toV = toV.normalize().mult(force * 0.005)
      n1.vel.add(toV)
      n2.vel.sub(toV)

    }
  }
}



  function windowResized() {
    var canvasstyle = document.getElementsByTagName("canvas")[0].style;
    var windowRatio = window.innerWidth / window.innerHeight;
    var canvasRatio = width / height;
    if (windowRatio < canvasRatio) {
      canvasstyle.width = "100vw";
      canvasstyle.height = "auto";
    }
    else {
      canvasstyle.width = "auto";
      canvasstyle.height = "100vh";
    }
  }
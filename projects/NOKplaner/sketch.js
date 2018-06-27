
const WAIT  = 0
const TRACK = 1

class TrackSegment {
  constructor(type, length) {
    this.type = type
    this.length = length
  }
}

class Ship {
  constructor(name, startTime, speed, dir) {
    this.name = name
    this.startTime = startTime
    this.speed = speed
    this.dir = dir
    this.plan = [] //contains the enters of the segments
  }

  draw() {

  }

  inSegment(seg, time) {
    for(let i = 0; i < this.plan.length; i++) {
      
    }
  }
}

const track = [
  new TrackSegment(WAIT, 1000),
  new TrackSegment(TRACK, 4000),
  new TrackSegment(WAIT, 300),
  new TrackSegment(TRACK, 7000),
  new TrackSegment(WAIT, 200),
  new TrackSegment(TRACK, 3000),
  new TrackSegment(WAIT, 1000)
]

const twidth = track.reduce((a, c) => a + c.length, 0)

let ships = []

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  window.addEventListener("resize", updateCanvasStyle)
  updateCanvasStyle()
}

function registerShip(ship) {
  ships.push(ship)
}

function draw() {
  background(50)
  drawTrack()
}

function drawTrack() {
  let cpos = 0
  stroke(255)
  fill(100, 100, 0)
  for(let i = 0; i < track.length; i++) {
    const seg = track[i]
    //draw first line
    let p1x = map(cpos, 0, twidth, 20, width - 20)
   

    if(seg.type == WAIT) {
      //Draw box
      let p2x = map(cpos + seg.length, 0, twidth, 20, width - 20)
      rect(p1x, -2, p2x - p1x, height + 2)
    }
    else {
      line(p1x, 0, p1x, height)
    }
    cpos += seg.length
  }
}

function updateCanvasStyle() {
  resizeCanvas(window.innerWidth, window.innerHeight)
  let canvasstyle = document.getElementsByTagName("canvas")[0].style

  let canvasRatio = width / height
  let windowRatio = window.innerWidth / window.innerHeight

  if(windowRatio < canvasRatio) {
      canvasstyle.height = "auto"
      canvasstyle.width  = "100vw"
  }
  else {
      canvasstyle.height = "100vh"
      canvasstyle.width  = "auto"
  } 
}
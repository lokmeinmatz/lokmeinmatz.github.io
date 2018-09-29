let gw = 300
let gh = 300
let field = new Uint8Array(gw * gh)

function setup() {
  // put setup code here
  let canvas = createCanvas(window.innerWidth, window.innerHeight)




  offset = createVector(0, 0)
}

function advance() {
  let newField = new Uint8Array(gw * gh)
  for(let x = 0; x < gw; x++) {
    for(let y = 0; y < gh; y++) {
      let oldval = field[y * gw + x] 
      let newval = 0
      if(oldval == 2) newval = 3
      else if(oldval == 3) newval = 1
      else if(oldval == 1) {
        let count = 0
        for(let dx = Math.max(x - 1, 0); dx <= Math.min(x + 1, gw); dx++) {
          for(let dy = Math.max(y - 1, 0); dy <= Math.min(y + 1, gh); dy++) {
            count += (field[dy * gw + dx] == 2) ? 1 : 0
          }
        }
        if(count == 1 || count == 2) {
          newval = 2
        }
        else newval = 1
      }
      newField[y * gw + x] = newval
    }  
  }
  
  field = newField
}

let offset
let zoom = 10

let lastFrameMouseDown = undefined
let play = false

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  console.log(zoom)
  zoom -= event.delta * sqrt(zoom) * 0.1;
  zoom = constrain(zoom, 0.01, 20)
  //uncomment to block page scrolling
  //return false;
}

function mouseDragged(event) {
  if(mouseButton == RIGHT) {
    offset.x += event.movementX
    offset.y += event.movementY
  }
}

function keyPressed() {
  if (keyCode === 32) {
    play = !play
  }
  else if(keyCode == 82) {
    console.log('reset')
    field.fill(0)
  }
}

document.addEventListener('contextmenu', event => event.preventDefault())
document.addEventListener('mousedown', event => {if(event.buttons == 4) event.preventDefault()})


function plotLineLow(x0, y0, x1, y1, mode) {
  let dx = x1 - x0
  let dy = y1 - y0

  let yi = 1

  if(dy < 0) {
    yi = -1
    dy = -dy
  }

  let d = 2 * dy - dx
  let y = y0

  for(let x = x0; x <= x1; x++) {
    field[y * gw + x] = mode
    if(d > 0) {
      y += yi
      d -= 2*dx
    }
    d += 2*dy
  }
}

function plotLineHigh(x0, y0, x1, y1, mode) {
  let dx = x1 - x0
  let dy = y1 - y0

  let xi = 1

  if(dx < 0) {
    xi = -1
    dx = -dx
  }

  let d = 2 * dx - dy
  let x = x0

  for(let y = y0; y <= y1; y++) {
    field[y * gw + x] = mode
    if(d > 0) {
      x += xi
      d -= 2*dy
    }
    d += 2*dx
  }
}

function plotLine(x0,y0, x1,y1, mode){
  if(abs(y1 - y0) < abs(x1 - x0)) {
    if(x0 > x1) plotLineLow(x1, y1, x0, y0, mode)
    else plotLineLow(x0, y0, x1, y1, mode)

  }
  else {
    if(y0 > y1) plotLineHigh(x1, y1, x0, y0, mode)
    else plotLineHigh(x0, y0, x1, y1, mode)
  }
}

let time = 0.1
let lastframe = 0

function draw() {
  if(play) {
    if((new Date().getTime() - lastframe) / 1000 > time) {
      advance()
      lastframe = new Date().getTime()
    }
  }

  //logic
  //calculate mouse position on grid
  let gx = mouseX - offset.x - width / 2
  let gy = mouseY - offset.y - height / 2

  gx /= zoom
  gy /= zoom
  gx = floor(gx)
  gy = floor(gy)

  if(!(gx < 0 || gx >= gw || gy < 0 || gy >= gh) && mouseIsPressed) {
    if(mouseButton == LEFT) {
      let mode = (keyIsPressed && keyCode == 17) ? 0 : 1
      console.log(mode)
      field[gy * gw + gx] = mode

      if(lastFrameMouseDown) {
        plotLine(lastFrameMouseDown.x, lastFrameMouseDown.y, gx, gy, mode)
      }

      lastFrameMouseDown = {x: gx, y: gy}
    }
    
    if(mouseButton == CENTER && field[gy * gw + gx] == 1) {
      field[gy * gw + gx] = 2
    }
  }
  else {
    lastFrameMouseDown = undefined
  }


  background(0)
  // put drawing code here
  translate(offset.x + width / 2, offset.y + height / 2)
  scale(zoom)
  
  stroke(255)
  fill(0)
  rect(-1, -1, gw + 1, gh + 1)
  
  noStroke()

  for(let x = 0; x < gw; x++) {
    for(let y = 0; y < gh; y++) {
      let val = field[y * gw + x]
      if(val == 0) continue
      if(val == 1) fill(200, 150, 0) // wire
      else if(val == 2) fill(255, 20, 0) // start
      else if(val == 3) fill(0, 30, 255) // end
      rect(x, y, 1, 1)
    }
  }
  //noLoop()
}
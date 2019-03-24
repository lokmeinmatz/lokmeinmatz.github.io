
let angle = 0
let path = []


function setup() {
  console.log("Started")
  createCanvas(1080, 1080)
}


function draw() {
  background(20)
  translate(width/2, height/2)
  noFill()
  stroke(255)
  angle += 1
  if (angle >= 360) angle = 0
  let rang = radians(angle)
  let x = 16.0 * pow(sin(rang), 3)
  let y = 13.0 * cos(rang) - 5 * cos(2 * rang) - 2 * cos(3 * rang) - cos(4 * rang)
  path.push({x: x, y: -y})

  // draw
  if (path.length < 2) return
  

  let previous = path[0]
  for (let i = 1; i < path.length; i++) {
    let next = path[i]
    next.x *= 1.001
    next.y *= 1.001
    line(previous.x, previous.y, next.x, next.y)

    previous = next
  }

  
}
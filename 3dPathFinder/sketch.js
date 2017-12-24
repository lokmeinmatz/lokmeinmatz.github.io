const grid = []
let texture;
let pathTex;
let finalPath = []
let finalPathSmoothed = []

const zScale = 1000;
const UPF = 60;
let plotHeight = false

function convertHeight1(x, s, h) {
  return constrain(Math.pow((x + 0.5) * s - s, 3) + h, 0, 1)
}

function convertHeight2(x, s, h) {
  return sqrt(x * 2.25) - 0.5
}

class Cell {
  constructor(x, y) {
    this.f = 0
    this.g = 1000000000
    this.cameFrom = null
    this.closed = false;
    this.x = x
    this.y = y
    this.height = convertHeight2(noise(x*.01, y*.01), 3, 0.45);
    this.difficulty = this.height >= 0.4 ? 1 : 5
  }
}

function getTerrainColor(height){
  if(height < 0.3) return [10, 20, 200];
  if(height < 0.4) return [40, 50, 250];
  else if(height < 0.5) return [210, 210, 20];
  else if(height < 0.7) return [20, 150, 20];
  else return [100, 100, 100];
}

let openSet = new Set()
let start
let end
let foundPath = false

function setup() {
  createCanvas(400, 300);
  console.log("Creating grid")
  for(let x = 0; x < width; x++) {
    grid[x] = new Array(height);
    for(let y = 0; y < height; y++) {
      grid[x][y] = new Cell(x, y)
    }
  }


  console.log("Finished grid")
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  console.log("Rendering texture...")
  drawToImage()
  pathTex = createImage(width, height)
  console.log("Finished texture...")
  start = grid[4][4]
  end = grid[width-4][height-4]
  start.g = 0
  start.f = dist(4, 4, start.height * zScale, width-4, height-4, end.height * zScale);
  openSet.add(start);
}


function drawToImage() {
  texture = createImage(width, height)
  texture.loadPixels()
  let u8array = texture.imageData.data
  for(let x = 0; x < width; x++) {
    if(x%10 == 0) console.log(x)
    for(let y = 0; y < height; y++) {
      let height = grid[x][y].height
      let c = getTerrainColor(height)
      u8array[(x + y * width) * 4 + 0] = c[0] * height
      u8array[(x + y * width) * 4 + 1] = c[1] * height
      u8array[(x + y * width) * 4 + 2] = c[2] * height
      u8array[(x + y * width) * 4 + 3] = 255
    }
  }
  texture.updatePixels()
}


function getNeighbours(x, y) {
  let res = []

  if(x > 0)res.push(grid[x-1][y])
  if(x < width-1)res.push(grid[x+1][y])
  if(y > 0)res.push(grid[x][y-1])
  if(y < height-1)res.push(grid[x][y+1])


  if(x > 0 && y > 0)res.push(grid[x-1][y-1])
  if(x < width-1 && y > 0)res.push(grid[x+1][y-1])
  if(x > 0 && y < height-1)res.push(grid[x-1][y+1])
  if(x < width-1 && y < height-1)res.push(grid[x+1][y+1])


  return res
}

function calcSmoothedPath() {
  finalPathSmoothed = []
  for(let i = 0; i < finalPath.length; i++) {
    finalPathSmoothed.push({x: finalPath[i].x,y:finalPath[i].y, height:finalPath[i].height});
  }
  for(let iteration = 0; iteration < 50; iteration++) {
    for(let i = 1; i < finalPath.length-1; i++) {
      let prev = finalPathSmoothed[i - 1]
      let next = finalPathSmoothed[i + 1]
      let self = finalPathSmoothed[i]
      let avgx = (prev.x + self.x + next.x)/3
      let avgy = (prev.y + self.y + next.y)/3
      finalPathSmoothed[i] = {x: avgx, y: avgy, height: grid[floor(avgx)][floor(avgy)].height}
    }
  }
}

function draw() {
  clear();
  if(texture) image(texture, 0, 0);

  //draw path
  pathTex.loadPixels()
  let u8array = pathTex.pixels
  for(let i = 0; i < u8array.length; i++) {
    u8array[i] = 0
  }

  //Draw openSet
  for(node of openSet) {
    let i = node.x + node.y * width
    u8array[i*4 + 0] = 255
    u8array[i*4 + 3] = 255
  }

  //Draw final path
  for(node of finalPath) {
    let i = node.x + node.y * width
    u8array[i*4 + 1] = 255
    u8array[i*4 + 3] = 80
  }

  //Draw smoothed path
  
  for(node of finalPathSmoothed) {
    let i = floor(node.x) + floor(node.y) * width
    u8array[i*4 + 1] = 150
    u8array[i*4 + 0] = 150
    u8array[i*4 + 3] = 255
  }

  
  pathTex.updatePixels()
  image(pathTex, 0, 0)

  


  for(let update = 0; update < UPF; update++) {
    if(openSet.size > 0 && !foundPath) {
      let current = openSet.values().next().value
      //console.log(current)
      
      openSet.forEach((val1, val2, set) => {
        if (val1.f < current.f) current = val1
      })
   
      //remove from open list
      openSet.delete(current)
      if(current == end || update == UPF-1) {
        //Found end
        finalPath = []
        while (current.cameFrom) {
          finalPath.push(current)
          current = current.cameFrom
        }
        
        calcSmoothedPath()
        
      }
      if(current == end) {
        foundPath = true
        return
      }
      current.closed = true
  
      for(let neighbour of getNeighbours(current.x, current.y)) {
        if(neighbour.closed) continue
        openSet.add(neighbour)
  
        let temp_g = current.g + dist(current.x, current.y, current.height * zScale, neighbour.x, neighbour.y, neighbour.height * zScale) * current.difficulty
        if(temp_g >= neighbour.g) continue
        neighbour.cameFrom = current
        neighbour.g = temp_g
        neighbour.f = temp_g + dist(neighbour.x, neighbour.y, neighbour.height * zScale, end.x, end.y, end.height * zScale)
  
      }
  
    }
  }


  if(plotHeight) {
    noStroke()
    fill(255, 255, 255, 100)
    rect(0, 0, width, 200)
    loadPixels()
    for(let x = 0; x < finalPath.length; x++) {
      let mappedX = floor(map(x, 0, finalPath.length, width, 0))
      let height = floor(150 - finalPath[x].height * 150)
      
      pixels[(mappedX + height * width) * 4] = 255
      pixels[(mappedX + height * width) * 4 + 1] = 0
      pixels[(mappedX + height * width) * 4 + 2] = 0
      pixels[(mappedX + height * width) * 4 + 3] = 255
    }


    for(let x = 0; x < finalPathSmoothed.length; x++) {
      let mappedX = floor(map(x, 0, finalPathSmoothed.length, width, 0))
      let height = floor(150 - finalPathSmoothed[x].height * 150)
      
      pixels[(mappedX + height * width) * 4 + 0] = 0
      pixels[(mappedX + height * width) * 4 + 1] = 255
      pixels[(mappedX + height * width) * 4 + 2] = 0
      pixels[(mappedX + height * width) * 4 + 3] = 255
    }
    updatePixels()
    //Wasser : 0.4
    stroke(0, 0, 255)
    line(0, 150*0.6, width, 150*0.6)
  }
}

function keyTyped() {
  if(key == "s") {
    plotHeight = !plotHeight
  }
}

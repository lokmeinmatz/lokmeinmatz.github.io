let loclist
let landmap


class Poly {
  constructor(coords) {
    this.coords = coords
    
    this.bb = {
      minx: 300,
      miny: 300,
      maxx: -300,
      maxy: -300
    }

    for (let c of coords) {
      if(c[0] < this.bb.minx) this.bb.minx = c[0]
      if(c[1] < this.bb.miny) this.bb.miny = c[1]
      if(c[0] > this.bb.maxx) this.bb.maxx = c[0]
      if(c[1] > this.bb.maxy) this.bb.maxy = c[1]
    }
  }

  draw() {
    console.log(`Drawing ${this.coords.length} verts`)
    beginShape()
    for(let i = 0; i < this.coords.length; i++) {
      let curr = mapCoords(this.coords[i][1], this.coords[i][0], false)
      vertex(curr[0], curr[1])
    }
    endShape()
  }

  drawBB() {
    let mtl = mapCoords(this.bb.miny, this.bb.minx)
    let mbr = mapCoords(this.bb.maxy, this.bb.maxx)
    push()
    rectMode(CORNERS)
    noFill()
    stroke(0, 255, 0)
    rect(mtl[0], mtl[1], mbr[0], mbr[1])
    pop()
  }

  inView(topLeft, bottomRight) {
    
    if(topLeft[0] > this.bb.maxx || bottomRight[0] < this.bb.minx) return false
    if(topLeft[1] > this.bb.maxy|| bottomRight[1] < this.bb.miny) return false
    return true
  }
}

function preload() {
  loclist = loadStrings("compressedLoc.json")
  landmap = loadJSON("ne_110m_land.geojson")
}


let _zoom = 2
Object.defineProperty(window, 'zoom', {
  get: () => _zoom,
  set: v => {
    _zoom = v
    drawMap()
  }
})
let _xoffset = 0
Object.defineProperty(window, 'xoffset', {
  get: () => _xoffset,
  set: v => {
    _xoffset = v
    drawMap()
  }
})
let _yoffset = 0
Object.defineProperty(window, 'yoffset', {
  get: () => _yoffset,
  set: v => {
    _yoffset = v
    drawMap()
  }
})



let maxacc
function mapCoords(lat, lon, needremap) {
  if(needremap) {
    lat /= 10000000
    lon /= 10000000
  }
  const nlat = (lat + yoffset) * zoom * zoom
  const nlon = (lon + xoffset) * zoom * zoom
  return [nlon, -nlat]
}

function mapPixel(x, y) {
  y = -y
  x /= zoom * zoom
  y /= zoom * zoom
  x -= xoffset
  y += yoffset
  return [y, x] //y = lat, x = lon
}

function drawMap() {
  background(30);
  push()
  translate(width/2, height/2)

  fill(10, 30, 200)
  stroke(20, 60, 255)

  let topLeft = mapPixel(-width/2, -height/2)
  topLeft[0] *= -1
  let bottomRight = mapPixel(width/2, height/2)
  bottomRight[0] *= -1

  push()
  noFill()
  stroke(255, 0, 0)
  strokeWeight(10)
  rectMode(CORNERS)
  let ptl = mapCoords(topLeft[0], topLeft[1])
  let pbr = mapCoords(bottomRight[0], bottomRight[1])

  rect(ptl[0], ptl[1], pbr[0], pbr[1])
  pop()


  for (let feature of landmap) {
    if(feature.inView(topLeft, bottomRight)) feature.draw()
    feature.drawBB()
  }

  //console.log(loclist.locations)
  //noStroke()
  strokeWeight(3)

  let prev = undefined

  for(let d of loclist) {
    //if(!d.l || !d.longitudeE7 || !d.accuracy || !d.altitude) continue
    const mc = mapCoords(d.lat, d.lon, true)
    const acc = d.acc
    const alt = d.alt

    if(prev != undefined) {
      stroke(alt, 255 - alt, 50, map(acc, 0, maxacc, 255, 0))
      //ellipse(lon, -lat, map(acc, 0, 2147467, 10, 21))
      line(prev[0], prev[1], mc[0], mc[1])

    }

    prev = mc

  }

  pop()

  console.log("Finished update")
}

function setup() {
  
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(DEGREES);
  background(30);
  
  loclist = JSON.parse(loclist)
  
  maxacc = loclist.reduce((max, cacc) => cacc.acc > max ? cacc.acc : max, 0)
  console.log("generating landmap")
  let worldmap = []
  for (let feature of landmap.features) {

    for (let geom of feature.geometry.coordinates) {
      worldmap.push(new Poly(geom))
    }
  }

  landmap = worldmap
  drawMap()
  
}




function draw() {
  
}

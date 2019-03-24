let loclist
let landmap


class Poly {
  constructor(coords) {
    this.coords = coords
    
    this.bb = {
      minlat: 300,
      minlon: 300,
      maxlat: -300,
      maxlon: -300
    }

    for (let c of coords) {
      if(c[1] < this.bb.minlat) this.bb.minlat = c[1]
      if(c[0] < this.bb.minlon) this.bb.minlon = c[0]
      if(c[1] > this.bb.maxlat) this.bb.maxlat = c[1]
      if(c[0] > this.bb.maxlon) this.bb.maxlon = c[0]
    }
  }

  draw() {

    beginShape()
    for(let i = 0; i < this.coords.length; i++) {
      let curr = mapCoords(this.coords[i][1], this.coords[i][0], false)
      vertex(curr[0], curr[1])
    }
    endShape()
  }

  drawBB(inView) {
    let mtl = mapCoords(this.bb.minlat, this.bb.minlon)
    let mbr = mapCoords(this.bb.maxlat, this.bb.maxlon)
    push()
    rectMode(CORNERS)
    noFill()
    if (inView)stroke(0, 255, 0)
    else stroke(255, 0, 0)
    rect(mtl[0], mtl[1], mbr[0], mbr[1])
    pop()
  }

  inView(topLeft, bottomRight) {
    
    if(topLeft[0] > this.bb.maxlat || bottomRight[0] < this.bb.minlat) return false
    if(topLeft[1] > this.bb.maxlon|| bottomRight[1] < this.bb.minlon) return false
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
  return [-y, x] //y = lat, x = lon
}

function drawMap() {
  const start = performance.now()
  background(30);
  push()
  translate(width/2, height/2)

  fill(10, 30, 200)
  stroke(20, 60, 255)

  let topLeft = mapPixel(-width/2, -height/2)
  let bottomRight = mapPixel(width/2, height/2)
  console.log(topLeft)
  console.log(bottomRight)
  push()
  noFill()
  stroke(255, 0, 0)
  strokeWeight(10)
  rectMode(CORNERS)
  let ptl = mapCoords(topLeft[0], topLeft[1])
  let pbr = mapCoords(bottomRight[0], bottomRight[1])

  rect(ptl[0], ptl[1], pbr[0], pbr[1])
  pop()

  let vertsDrawnTotal = 0
  for (let feature of landmap) {
    const fiv = feature.inView(topLeft, bottomRight)
    if(fiv) {
      feature.draw()
      vertsDrawnTotal += feature.coords.length
    }
    
    feature.drawBB(fiv)
  }
  console.log(`Drawn ${vertsDrawnTotal} verts`)

  //console.log(loclist.locations)
  //noStroke()
  const tilesize = 10
  const totlength = floor((width / tilesize) * (height / tilesize))
  const imap = new Array(totlength).fill(0, 0, totlength)
  
  let highest = 0
  for(let d of loclist) {
    //if(!d.l || !d.longitudeE7 || !d.accuracy || !d.altitude) continue
    const mc = mapCoords(d.lat, d.lon, true)
    mc[0] -= width / 2
    mc[1] -= height / 2
    mc[0] *= tilesize
    mc[1] *= tilesize
    let index = floor(mc[0] + mc[1] * width / tilesize)
    imap[index] += 1 / d.acc
    if (imap[index] > highest) highest = imap[index]
  }

  pop()
  noStroke()
  for(let x = 0; x < width / tilesize; x++) {
    for(let y = 0; y < height / tilesize; y++) {
      fill(lerpColor(color(255, 255, 255, 0), color(255, 100, 0, 255), imap[x+y*width / tilesize] / highest))
      rect(x * tilesize, y * tilesize, tilesize, tilesize)
    }
  }

  console.log(`Finished. took ${performance.now() - start} ms`)
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

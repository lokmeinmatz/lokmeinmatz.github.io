
let texture, overlay : p5.Image
function setup() {
  // put setup code here
  createCanvas(1500, 1000)
  windowResized()
  

  //generate Image
  const noiseScale = 0.001
  let heightMap : number[][] = []

  texture = createImage(width, height)
  texture.loadPixels()
  for(let x = 0; x < width; x++) {
    heightMap.push([])
    for(let y = 0; y < height; y++) {
      let index = (x + y * width) * 4
      let height = noise(x * noiseScale ,y * noiseScale)
      heightMap[x].push(height)
      //console.log(height)
      texture.pixels[index + 0] = height*255
      texture.pixels[index + 1] = height*255
      texture.pixels[index + 2] = height*255
      texture.pixels[index + 3] = 255
    }
  }

  texture.updatePixels()

  overlay = createImage(width, height)
  overlay.loadPixels()
  
}


function draw() {

  let deltatime = 1/frameRate()
  deltatime = (deltatime>0.1)?0:deltatime
  

  // put drawing code here
  //background(100, 150, 200)
  image(texture, 0, 0)
  //Draw rocket

  //Draw ground


  //Draw particles
  noStroke()
  fill(20, 20, 30, 50)

  // for(let p of particles) {
  //   p.draw()
  // }
}

function windowResized() {
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  let windowRatio = window.innerWidth / window.innerHeight
  let canvasRatio = width / height
  if(windowRatio < canvasRatio) {
    canvasstyle.width = "100vw";
    canvasstyle.height = "auto";
  }
  else {
    canvasstyle.width = "auto";
    canvasstyle.height = "100vh";
  }
}
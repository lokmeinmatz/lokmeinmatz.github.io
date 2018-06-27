
let tex : p5.Image

let color1: p5.Vector
let color2: p5.Vector

let STEPS = 3
const noiseScale = 0.0001
let spinnerDom : HTMLElement

function genColor() : p5.Vector {
  return p5.Vector.random3D().add(createVector(1, 1, 1)).mult(255 / 2)
}

const getCol = val => {
  val *= STEPS
  val = round(val)
  val /= STEPS
  return p5.Vector.lerp(color1, color2, val)
}

function keyReleased() {
  if(key == 'S')saveCanvas(`wallpaper_${new Date().getTime()}.png`, 'png')
  if(key == 'R'){
    spinnerDom.classList.remove('invisible')
    setTimeout(generate, 50)
  }
}

function generate() {
  //generate Image
  //color1 = createVector( 84,  19, 136)
  //color2 = createVector(217,   3, 104)
  color1 = genColor()
  color2 = genColor()
  console.log(color1)
  const noiseMap : number[][] = []
  let lowest = Number.POSITIVE_INFINITY
  let highest = Number.NEGATIVE_INFINITY

  do {
    lowest = Number.POSITIVE_INFINITY
    highest = Number.NEGATIVE_INFINITY

    let offsetX = random(0, 10 / noiseScale)
    let offsetY = random(0, 10 / noiseScale)

    console.log(`Generating noise at ${offsetX} ${offsetY}`)

    for(let x = 0; x < width; x++) {
      noiseMap[x] = []
      for(let y = 0; y < height; y++) {
        let h = noise((x + offsetX) * noiseScale ,(y + offsetY) * noiseScale) * 50 - 25
        h = constrain(h, 0, 1)
        noiseMap[x][y] = h
        highest = (highest < h) ? h : highest
        lowest  = (lowest  > h) ? h : lowest
      }
    }

    console.log(`Highest: ${highest} | Lowest: ${lowest}`)
  } while (highest - lowest < 0.01);
  

  
  tex = createImage(width, height)
  tex.loadPixels()

  for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
      let index = (x + y * width) * 4
      const h = noiseMap[x][y]
      let color = getCol(map(h, lowest, highest, 0, 1))
      //console.log(height)
      tex.pixels[index + 0] = color.x
      tex.pixels[index + 1] = color.y
      tex.pixels[index + 2] = color.z
      tex.pixels[index + 3] = 255
    }
  }

  tex.updatePixels()

  spinnerDom.classList.add('invisible')
}

function setup() {
  
  


  spinnerDom = document.getElementById('wait')
  console.log(spinnerDom)
  // put setup code here
  createCanvas(2560, 1440)
  windowResized()
  tex = createImage(width, height)
}


function draw() {

  let deltatime = 1/frameRate()
  deltatime = (deltatime>0.1)?0:deltatime
  

  // put drawing code here
  //background(100, 150, 200)
  image(tex, 0, 0)


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
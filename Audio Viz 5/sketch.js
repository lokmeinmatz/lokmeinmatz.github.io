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


function setup() {
  canvas = createCanvas(1800, 1000);
  updateCanvasScale()
  angleMode(DEGREES);
  console.log("Starting program...");
  
  
}

function draw() {
  colorMode(RGB);
  background(100);
  colorMode(HSB);
  stroke(255)


 
}

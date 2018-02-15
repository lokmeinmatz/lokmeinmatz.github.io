function setup() {
  // put setup code here
  createCanvas(1000, 600)
  windowResized()
}

function draw() {
  // put drawing code here
  background(2)
}

function windowResized() {
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  let windowRatio = window.innerwidth / window.innerheight
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
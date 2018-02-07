
function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);
  console.log("Starting Audio...");
 
}


function draw() {
  colorMode(RGB);
  background(0, 0, 0, 120);
  colorMode(HSB);
  noStroke();




}

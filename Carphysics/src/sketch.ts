
const ground = 850



class Rocket {
  
}

function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);


}

let lastFrameMouse = false

function draw() {


  //new click
  if(mouseIsPressed) {
    if(!lastFrameMouse) {
      //new click
      
    }

  }
  else {
    
  }
  lastFrameMouse = mouseIsPressed

  background(100, 150, 255);
  //draw floor
  stroke(255)
  line(0, ground, width, ground)
  

 
  //UI
  fill(255)
  noStroke()
  textSize(20)

  text(frameRate().toFixed(2).toString(), 15, 40)
  if(frameRate() > 1 && frameRate() < 200) {
    dt = 1 / frameRate()
  }

}

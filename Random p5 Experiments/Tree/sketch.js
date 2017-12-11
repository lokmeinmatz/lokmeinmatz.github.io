

class Branch {
  constructor(pos, dir, strength, color) {
    this.pos = pos;
    this.dir = dir;
    this.strength = strength;
    this.color = color;
  }


  draw(){
    stroke(this.color);
    // fill(this.color);
    // ellipse(this.pos.x, this.pos.y, 10);
    strokeWeight(this.strength);
    line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y);
  }

  mutate(d){
    this.dir.x += randomGaussian(0, d);
    this.dir.y += randomGaussian(0, d);
  }
}

function setup() {
  createCanvas(2560, 1440);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
}

function mousePressed(){
  redraw();
}

function keyPressed(){
  if(keyCode == UP_ARROW)saveCanvas("wallpaper", "png");
}

function drawBranch(branch){
  branch.draw();
  //console.log("drawing branch at "+branch.pos);
  if(branch.strength > 0.5){

    let b1 = new Branch(createVector(branch.pos.x + branch.dir.x, branch.pos.y + branch.dir.y), branch.dir.copy(), branch.strength - (random() * 0.8), branch.color);
    b1.mutate(4);
    drawBranch(b1);

    if(random() > 0.92){
      let b2 = new Branch(createVector(branch.pos.x + branch.dir.x, branch.pos.y + branch.dir.y + 1), branch.dir.copy(), branch.strength - (random() * 0.8), branch.color);
      b2.mutate(10);

      drawBranch(b2);
    }
  }
}


function draw() {
  colorMode(RGB);
  background(0, 0, 0, 10);
  //colorMode(HSB);
  noStroke();
  colorMode(HSB);
  let b = new Branch(createVector(width/2, height/2), p5.Vector.random2D(), 10.0, color(random(360), 80, 80));
  drawBranch(b);
  //saveCanvas("wallpaper","png");
  noLoop();
}

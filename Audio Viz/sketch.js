let mic, fft;
const res = 512;
function particle(x, y, vx, vy, color){
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.color = color;
  this.dtavg = 0;

  this.update = function(dt){
    this.dtavg += dt;
    this.dtavg /= 1.5;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    constrain(this.x,0,width);
    constrain(this.y,0,height);

    if(this.x < 0 || this.x >= width)this.vx *= -1;
    if(this.y < 0 || this.y >= height)this.vy *= -1;
  }

  this.draw = function(){
    fill(this.color);
    ellipse(this.x, this.y, this.dtavg);
  }
}

function setup() {
  createCanvas(1000, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.2, res);
  fft.setInput(mic);


  for(let i = 0; i < res/2; i++){
    colorMode(HSB);
    let p = new particle(random(width), random(height), random() - 0.5, random() - 0.5, color(i + 80, 60, 80) );
    particles.push(p);
  }
}



let sinu = 0;

let particles = [];

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 80);
  let level = mic.getLevel() * 100;
  let spectrum = fft.analyze();
  sinu += level * 10;
  noStroke();
  for(let i = 0; i < res/2; i++){
    particles[i].update(spectrum[i]/10);
    particles[i].draw();
  }




}

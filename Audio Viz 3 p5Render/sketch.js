let mic, fft;
const res = 256;
function particle(x, y, vy, color, r){
  this.x = x;
  this.y = y;
  this.vy = vy;
  this.color = color;
  this.r = r;

  this.update = function(dt){
    this.r  = lerp(this.r, 0, 0.002);
    this.y += this.vy * dt;

  }

  this.draw = function(){
    stroke(this.color);
    point(this.x, this.y);
  }
}

function setup() {
  createCanvas(1200, 800);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);

  mic = new p5.AudioIn();
  mic.start();
  console.log(mic);
  fft = new p5.FFT(0.2, res);
  fft.setInput(mic);



}




let particles = [];
let threshold = 160;
function draw() {
  colorMode(RGB);
  background(0, 0, 0, 60);
  let level = mic.getLevel() * 100;
  let spectrum = fft.analyze();
  noFill();
  colorMode(HSB);
  for(let i = 0; i < res/2; i++){
    if(spectrum[i] > threshold){
      let p = new particle(map(i, 0, res/2, 0, width), -5, 1, color(i + 80, 60, 80) , spectrum[i]/10);
      particles.push(p);
    }
  }

  for(let i = 0; i < particles.length; i++){
    if(particles[i]){
      particles[i].update(5);
      particles[i].draw();
      if(particles[i].y > height + 20){
        particles.splice(i, 1);
        i--;
      }
    }

    colorMode(RGB);
    fill(255);
    text("particles: "+particles.length, 10, 10);
  }


}

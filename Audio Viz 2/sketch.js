let mic, fft;
const res = 256;
const smoothing = 0.999;
const cutoff = 0.7;
const avg = [];
let factor = 1;
let menu = false;

let menudiv;
let factorslider;
let lastfactorSlider = 1;
let factorinput;
let lastFactorInput = 1;
function particle(x, y, vx, vy, color){
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.color = color;
  this.dtavg = 0;

  this.update = function(dt){
    this.dtavg += dt;
    this.dtavg  = lerp(this.dtavg, 0, 0.2);
    this.x += this.vx * dt;
    this.y += this.vy * dt * 5;
    constrain(this.x,0,width);
    constrain(this.y,0,height);
    this.y = lerp(this.y, height/2, .08);
    //if(this.x < 0 || this.x >= width)this.vx *= -1;
    //if(this.y < 0 || this.y >= height)this.vy *= -1;
  }

  this.draw = function(){
    fill(this.color);
    ellipse(this.x, this.y + width/3, this.dtavg);
  }
}

function keyReleased(){
  menu = !menu;
  console.log("Menu "+(menu?"opened":"closed"));
}

function setup() {
  createCanvas(1500, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.8, res);
  fft.setInput(mic);


  for(let i = 0; i < res * cutoff; i++){
    colorMode(HSB);
    let p = new particle(map(i, 0, res * cutoff, 0, width - 10) + 5, height/2, 0, -1, color(i + 80, 60, 80) );
    particles.push(p);
    avg[i] = 10;
  }


  //create Menu
  menudiv = createDiv("Settings");
  menudiv.style("color", "#fff");
  menudiv.style("background-color", "rgba(255, 255, 255, 0.1)");
  menudiv.style("position", "absolute");
  menudiv.style("top", "100px");
  menudiv.style("left", "100px");
  menudiv.style("padding", "10px");

  let facsliderdiv = createDiv("Strength");
  facsliderdiv.parent(menudiv);
  factorslider = createSlider(0.1, 10, 1);
  factorslider.parent(facsliderdiv);

  factorinput = createInput(1, "number");
  factorinput.parent(facsliderdiv);
}



let sinu = 0;

let particles = [];

function draw() {

  //menu update
  if(lastFactorInput != factorinput.value()){
    //change slider
    factorslider.value(factorinput.value())
    lastFactorInput = factorinput.value();
  }

  if(lastfactorSlider != factorslider.value()){
    //change slider
    factorinput.value(factorslider.value())
    lastfactorSlider = factorslider.value();
  }

  factor = factorinput.value();

  colorMode(RGB);
  background(0, 0, 0, 60);
  let level = mic.getLevel() * 100;
  let spectrum = fft.analyze();
  sinu += level * 10;
  noStroke();



  for(let i = 0; i < res * cutoff; i++){

    //adjust strength of avg and spectrum
    avg[i] = lerp(spectrum[i], avg[i], smoothing);
    spectrum[i] /= avg[i] + 1;


    particles[i].update(spectrum[i] * factor);
    particles[i].draw();
  }





}

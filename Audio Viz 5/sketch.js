let mic, fft;
const res = 256;

let data = [];
const avg = [];
const smoothing = 0.999;

const r = 50;

function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);
  console.log("Starting Audio...");
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.05, res);
  fft.setInput(mic);

  for(let y = 0; y < res; y++){
    avg[y] = 40;
  }

  for(let x = 0; x < width; x++){
    data.push(0);

  }
}



let sinu = 0;

let particles = [];

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 120);
  colorMode(HSB);
  noStroke();



  let spectrum = fft.analyze();

  //calculate weighted average
  let dividend = 0.0;
  let divisor = 0.0;


  for(let i = 0; i < spectrum.length; i++){
    avg[i] = lerp(spectrum[i], avg[i], smoothing);
    spectrum[i] /= avg[i] + 1;
    dividend += spectrum[i]*i;
    divisor += spectrum[i];
    //console.log(spectrum[0]);
  }

  //console.log(highest.i);
  let result = dividend / divisor;
  console.log(result);
  data.push(result);

  if(data.length > width){
    data.splice(0, 1);
  }
  //console.log(data.length);
  //Draw

  for(let x = data.length - 1; x >= 1; x--){
    stroke(map(x, 0, data.length, 0, 360), 50, 70);

    let current = data[x];
    let next = data[x-1];



    //console.log(current);
    line(x, current * 10, x-1, next * 10);

  }



}

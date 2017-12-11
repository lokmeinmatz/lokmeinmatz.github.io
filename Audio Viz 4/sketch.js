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

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.05, res);
  fft.setInput(mic);

  for(let y = 0; y < height / r; y++){
    avg[y] = 40;
  }

  for(let x = 0; x < width / r; x++){
    data.push([]);
    for(let y = 0; y < height / r; y++){
      data[x][y] = 0;
    }

  }
}



let sinu = 0;

let particles = [];

function draw() {
  colorMode(RGB);
  background(0, 0, 0, 120);
  colorMode(HSB);
  noStroke();

  data.splice(0, 1);

  let spectrum = fft.analyze();
  let newA = [];

  for(let i = 0; i < data[0].length; i++){
    avg[i] = lerp(spectrum[i], avg[i], smoothing);
    spectrum[i] /= avg[i] + 1;
    newA[i] = map(spectrum[floor(map(i, 0, data[0].length, 0, res/1.5))], 0, 255, 3, r*2);
  }
  data.push(newA);
  //Draw
  for(let x = 0; x < data.length; x++){
    fill(map(x, 0, data.length, 0, 360), 50, 70);
    for(let y = 0; y < data[0].length; y++){
      ellipse(x * r, y * r, data[x][y] * 1);
    }

  }



}

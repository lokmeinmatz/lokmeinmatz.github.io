/*
Author: Matthias Kind
Original idea by javidx9 (youtube.com)
*/


let ctx = null;
let canvas = null;
let width = 0,
    height = 0;
let keys = new Array(91);
keys.fill(false, 0, 90);
let ImageData = null;

let lastTime = 0;
let fpsCounter = 0;
let secondTimer = 0;


//clamp prototype
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function engineInit() {
  canvas = document.getElementById('canvas');
  width = canvas.width;
  height = canvas.height;
  ctx = canvas.getContext("2d");
  ImageData = ctx.getImageData(0, 0, width, height);
  init();
  lastTime = performance.now();
  setInterval(engineUpdate, 33/2);
}


function engineUpdate() {
  fpsCounter++;


  let now = performance.now();
  let deltatime = (now - lastTime)/1000.0;
  lastTime = now;
  secondTimer += deltatime;

  if(secondTimer >= 1){
    secondTimer = 0;
    console.log("FPS: ", fpsCounter);
    fpsCounter = 0;
  }

  update();

  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);
  ImageData = ctx.getImageData(0, 0, width, height);

  drawPixels();
  //after draw: set new Image Data
  ctx.putImageData(ImageData, 0, 0);

  drawContext(ctx);
}

function getPixel(x, y) {
  if(x < 0 || y < 0 || x >= width || y >= height){
    return undefined;
  }
  let color = new Color(0, 0, 0, 0);
  let index = y * width * 4 + x * 4;
  color.r = ImageData.data[index];
  color.g = ImageData.data[index + 1];
  color.b = ImageData.data[index + 2];
  color.a = ImageData.data[index + 3];
  return color;
}

function setPixel(x, y, color) {
  if( !(color instanceof Color) || x < 0 || y < 0 || x >= width || y >= height ){
    //console.error("Error while setting Pixel!");
    return;
  }
  x = Math.floor(x);
  y = Math.floor(y);

  let index = y * width * 4 + x * 4;
  ImageData.data[index] = color.r;
  ImageData.data[index + 1] = color.g;
  ImageData.data[index + 2] = color.b;
  ImageData.data[index + 3] = color.a;

}

function drawColorArray(x, y, colors){
  for(let i = 0; i < colors.length; i++){
    setPixel(x + i, y, colors[i]);
  }
}

function drawColorArrayAlpha(x, y, colors){
  for(let i = 0; i < colors.length; i++){
    if(colors[i].a < 1)continue;
    setPixel(x + i, y, colors[i]);
  }
}

function Color(r, g, b, a){
  this.r = clamp(r, 0, 255);
  this.g = clamp(g, 0, 255);
  this.b = clamp(b, 0, 255);
  this.a = clamp(a, 0, 255);

  this.copy = function () {
    return new Color(this.r, this.g, this.b, this.a);
  }

  this.check = function () {
    this.b = clamp(this.b, 0, 255);
    this.a = clamp(this.a, 0, 255);
    this.r = clamp(this.r, 0, 255);
    this.g = clamp(this.g, 0, 255);
  }

  this.multiply = function(fac){
    this.r *= fac;
    this.g *= fac;
    this.b *= fac;
    this.a *= fac;
  }
}


document.addEventListener("keydown", function(event) {
  if(event.keyCode > 0 && event.keyCode <= 90){
    keys[event.keyCode] = true;
  }
});

document.addEventListener("keyup", function(event) {
  if(event.keyCode > 0 && event.keyCode <= 90){
    keys[event.keyCode] = false;
  }
});

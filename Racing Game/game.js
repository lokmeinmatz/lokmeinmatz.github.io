let ctx = null;
let canvas = null;
let width = 0,
    height = 0;

let ImageData = null;

function init() {
  canvas = document.getElementById('canvas');
  width = canvas.width;
  height = canvas.height;
  ctx = canvas.getContext("2d");
  ImageData = ctx.getImageData(0, 0, width, height);
  setInterval(update, 33);
}


function update() {
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);
  ImageData = ctx.getImageData(0, 0, width, height);




  //after update: set new Image Data
  ctx.putImageData(ImageData, 0, 0);
}

function getPixel(x, y) {
  if(x < 0 || y < 0 || x >= width || y >= height){
    return undefined;
  }
  let color = {};
}

function Color(r, g, b, a){
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

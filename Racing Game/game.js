let ctx = null;
let canvas = null;
let width = 0,
    height = 0;

let ImageData = null;

let car = {
  fPos: 0,
  Color_TIRE: new Color(25, 25, 25, 255),
  Color_BODY: new Color(25, 25, 150, 255),
  Shape: [
    [0,0,0,1,1,0,0,0,0,2,2,0,0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0,2,2,2,2,0,0,0,1,1,0,0,0],
    [0,0,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,0,0],
    [0,0,0,1,1,0,0,0,2,2,2,2,0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,2,2,2,2,2,2,0,0,1,1,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0],
    [0,1,1,1,0,0,2,2,2,2,2,2,2,2,0,0,1,1,1,0],
    [0,1,1,1,0,0,2,2,2,2,2,2,2,2,0,0,1,1,1,0],
    [0,1,1,1,0,0,2,2,2,2,2,2,2,2,0,0,1,1,1,0],
    [0,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0],
    [0,1,1,1,0,0,2,2,2,2,2,2,2,2,0,0,1,1,1,0],
    [0,1,1,1,0,0,2,2,2,2,2,2,2,2,0,0,1,1,1,0],
    [0,1,1,1,0,0,0,0,2,0,0,2,0,0,0,0,1,1,1,0],
    [0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0],
  ],
};

//predefined colors
const Color_GRASS = new Color(10, 230, 20, 255);
const Color_RED = new Color(255, 0, 0, 255);
const Color_GRAY = new Color(60, 60, 60, 255);
const Color_TRANSPARENT = new Color(0, 0, 0, 0);

//clamp prototype
function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

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

  for(let y = 0; y < height/2; y++){
    for(let x = 0; x < width; x++){
      let fMiddlePoint = 0.5;
      let fRoadWidth = 0.6;
      let fClipWidth = fRoadWidth * 0.15;
      fRoadWidth *= 0.5;

      let iLeftGrass = (fMiddlePoint - fRoadWidth - fClipWidth) * width;
      let iLeftClip = (fMiddlePoint - fRoadWidth) * width;

      let iRightGrass = (fMiddlePoint + fRoadWidth + fClipWidth) * width;
      let iRightClip = (fMiddlePoint + fRoadWidth) * width;

      let iRow = height/2 + y;

      if(x < iLeftGrass)setPixel(x, iRow, Color_GRASS);
      else if(x < iLeftClip)setPixel(x, iRow, Color_RED);
      else if(x < iRightClip)setPixel(x, iRow, Color_GRAY);
      else if(x < iRightGrass)setPixel(x, iRow, Color_RED);
      else setPixel(x, iRow, Color_GRASS);

    }
    //draw car
    let iCarPos = width/2 + ((width * car.fPos) / 2) - 10;
    for(let i = 0; i < car.Shape.length; i++){
      
    }
    drawColorArrayAlpha(iCarPos, 100, )
  }


  //after update: set new Image Data
  ctx.putImageData(ImageData, 0, 0);
}

function getPixel(x, y) {
  if(x < 0 || y < 0 || x >= width || y >= height){
    return undefined;
  }
  let color = new Color(0, 0, 0, 0);
  let index = (y * width + x) * 4;
  color.r = ImageData.data[index];
  color.g = ImageData.data[index + 1];
  color.b = ImageData.data[index + 2];
  color.a = ImageData.data[index + 3];
  return color;
}

function setPixel(x, y, color) {
  if( !(color instanceof Color) || x < 0 || y < 0 || x >= width || y >= height ){
    console.error("Error while setting Pixel!");
    return;
  }

  let index = (y * width + x) * 4;
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
}

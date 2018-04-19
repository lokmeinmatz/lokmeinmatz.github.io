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
let fCurvature = 0.0;
let fTrackCurvature = 0.0;
let fPlayerCurvature = 0.0;
let track = [
  [0, 10],
  [0, 400],
  [0.1, 200],
  [0, 400],
  [-0.1, 100],
  [0.1, 150],
  [0, 400],
];



let car = {
  fPos: 0,
  fSpeed: 0.0,
  yPos: 120,
  fDistance: 0,
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
  Colors: null,
  init: function () {
    this.Colors = this.Shape.map(function (line) {
      return line.map(function (number) {
        switch (number) {
          case 0:
            return Color_TRANSPARENT;
          case 1:
            return car.Color_TIRE;
          case 2:
            return car.Color_BODY;
          default:
            return Color_RED;

        }
      })
    })
  },
};

//predefined colors
const Color_GRASS = new Color(10, 230, 20, 255);
const Color_GRASS_LIGHT = new Color(20, 240, 30, 255);
const Color_RED = new Color(255, 0, 0, 255);
const Color_WHITE = new Color(255, 255, 255, 255);
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
  car.init();
  ImageData = ctx.getImageData(0, 0, width, height);
  setInterval(update, 33);
}


function update() {

  if(keys[38]){
    car.fSpeed += 0.05;
  }

  if(keys[37]){
    fPlayerCurvature -= 0.03;
  }

  if(keys[39]){
    fPlayerCurvature += 0.03;
  }

  if(Math.abs(fPlayerCurvature - fTrackCurvature) >= 0.8){
    //off track
    car.fSpeed -= 0.07;
  }

  else car.fSpeed -= 0.025;
  if(car.fSpeed < 0)car.fSpeed = 0.0;
  else if(car.fSpeed > 1)car.fSpeed = 1.0;

  car.fDistance += car.fSpeed * 4;

  let fOffset = 0.0;
  let iTrackSection = 0;

  while(fOffset <= car.fDistance){
    fOffset += track[iTrackSection][1];
    iTrackSection++;
    if(iTrackSection >= track.length)iTrackSection = 1;
  }
  let fTargetCurvature = track[iTrackSection - 1][0];

  let fTrackCurveDiff = (fTargetCurvature - fCurvature) * 0.04 * car.fSpeed;
  fCurvature += fTrackCurveDiff;

  fTrackCurvature += (fCurvature) * 0.3 * car.fSpeed;

  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillRect(0, 0, width, height);
  ImageData = ctx.getImageData(0, 0, width, height);

  for(let y = 0; y < height/2; y++){
    for(let x = 0; x < width; x++){

      let fPerspective = y / (height / 2);
      let fMiddlePoint = 0.5 + fCurvature * Math.pow(1 - fPerspective, 3);
      let fRoadWidth = 0.05 + fPerspective * 0.8;
      let fClipWidth = fRoadWidth * 0.15;
      fRoadWidth *= 0.5;

      let iLeftGrass = (fMiddlePoint - fRoadWidth - fClipWidth) * width;
      let iLeftClip = (fMiddlePoint - fRoadWidth) * width;

      let iRightGrass = (fMiddlePoint + fRoadWidth + fClipWidth) * width;
      let iRightClip = (fMiddlePoint + fRoadWidth) * width;

      let iRow = height/2 + y;

      let grass_color = Math.sin(20 * Math.pow(1.0 - fPerspective, 3) + car.fDistance * 0.1) > 0.0 ? Color_GRASS: Color_GRASS_LIGHT;
      let clip_color = Math.sin(100 * Math.pow(1.0 - fPerspective, 3) + car.fDistance * 0.5) > 0.0 ? Color_RED: Color_WHITE;

      if(x < iLeftGrass)setPixel(x, iRow, grass_color);
      else if(x < iLeftClip)setPixel(x, iRow, clip_color);
      else if(x < iRightClip)setPixel(x, iRow, Color_GRAY);
      else if(x < iRightGrass)setPixel(x, iRow, clip_color);
      else setPixel(x, iRow, grass_color);

    }
    //draw car
    car.fPos = fPlayerCurvature - fTrackCurvature;
    if(car.fPos > 0.95)car.fPos = 0.95;
    else if(car.fPos < -0.95)car.fPos = -0.95;
    let iCarPos = width/2 + ((width * car.fPos) / 2) - 10;
    for(let i = 0; i < car.Colors.length; i++){
      drawColorArrayAlpha(iCarPos, car.yPos + i, car.Colors[i]);
    }

  }


  //after update: set new Image Data
  ctx.putImageData(ImageData, 0, 0);
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

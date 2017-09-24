function init() {

}

let hour = 0,
    minute = 0,
    second = 0,
    milli = 0;

let colorheight = 20;

const col1 = new Color(200, 10, 10, 255);
const col2 = new Color(10, 200, 10, 255);
const col3 = new Color(10, 10, 200, 255);
const col4 = new Color(10, 100, 100, 255);

function update() {
  let currentDate = new Date();
  hour = currentDate.getHours();
  minute = currentDate.getMinutes();
  second = currentDate.getSeconds();
  milli = currentDate.getMilliseconds();
}

function drawPixels() {
  //Draw hour
  let pixHour = hour * (width / 24);
  for(let x = 0; x < pixHour; x++){

    let color = col1.copy();
    let brightness = x/(pixHour + 1);
    color.multiply(brightness);

    for(let y = 0; y < colorheight; y++){
      setPixel(x, y, color);
    }
  }

  //Draw minutes
  let pixMin = minute * (width / 60);
  for(let x = 0; x < pixMin; x++){
    let color = col2.copy();
    let brightness = x/(pixMin + 1);
    color.multiply(brightness);

    for(let y = colorheight; y < colorheight * 2; y++){
      setPixel(x, y, color);
    }
  }

  //Draw seconds
  let pixSec = second * (width / 60);
  for(let x = 0; x < pixSec; x++){
    let color = col3.copy();
    let brightness =  x/(pixSec + 1);
    color.multiply(brightness);

    for(let y = colorheight * 2; y < colorheight * 3; y++){
      setPixel(x, y, color);
    }
  }

  //Draw milli
  let pixMilli = milli * (width / 1000);
  for(let x = 0; x < pixMilli; x++){
    let color = col4.copy();
    let brightness = x/(pixMilli + 1);

    color.multiply(brightness);

    for(let y = colorheight * 3; y < colorheight * 4; y++){
      setPixel(x, y, color);
    }
  }
}

function drawContext(ctx) {

}

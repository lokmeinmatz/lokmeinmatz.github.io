
function keyPressed(){
  if(keyCode == UP_ARROW)saveCanvas("wallpaper", "png");
}

const STATES = {
  LOADING: 0,
  MAIN: 1,
};

let state = STATES.LOADING;

function setup() {
  createCanvas(2560, 800);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "auto";
  canvasstyle.width = "100vw";


}

let LoadingData = {
  time: 0.0,
};

function draw() {
  background(0);
  strokeWeight(sin(LoadingData.time*5)*2+5);
  switch(state){
    case STATES.LOADING:

      noFill();
      stroke(255);

      if(LoadingData.time < 1.0){
        arc(width/2, height/2, 200, 200, 0, TWO_PI * LoadingData.time);
      }
      else if(LoadingData.time < 1.5){
        ellipse(width/2, height/2, 200);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 - map(LoadingData.time, 1.0, 1.5, 150, -30), height/2 - 20);
      }
      else if(LoadingData.time < 2.0){
        ellipse(width/2, height/2, 200);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 +30, height/2 - 20);
        //draw diagonal line
        line(width/2 +30, height/2 - 20, width/2 - map(LoadingData.time, 1.5, 2.0, -30, 30), height/2 - map(LoadingData.time, 1.5, 2.0, 20, -20));
      }

      else if(LoadingData.time < 2.5){
        ellipse(width/2, height/2, 200);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 +30, height/2 - 20);
        //draw diagonal line
        line(width/2 +30, height/2 - 20, width/2 - 30, height/2 + 20);
        //draw right line
        line(width/2 - 30, height/2 + 20, width/2 + map(LoadingData.time, 2.0, 2.5, -30, 150), height/2 + 20);

      }
      else if(LoadingData.time < 7){

        ellipse(width/2, height/2, 200);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 +30, height/2 - 20);
        //draw diagonal line
        line(width/2 +30, height/2 - 20, width/2 - 30, height/2 + 20);
        //draw right line
        line(width/2 - 30, height/2 + 20, width/2 + 150, height/2 + 20);


        //draw loading dot
        noStroke();
        fill(255);

      }
      else if(LoadingData.time < 7.5){
        strokeWeight((sin(LoadingData.time*5)*2+5) * map(LoadingData.time, 7.0, 7.5, 1.0, 0.0));
        ellipse(width/2, height/2, 200);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 +30, height/2 - 20);
        //draw diagonal line
        line(width/2 +30, height/2 - 20, width/2 - 30, height/2 + 20);
        //draw right line
        line(width/2 - 30, height/2 + 20, width/2 + 150, height/2 + 20);


        //draw loading dot
        noStroke();
        fill(255);

      }
      else {
        state = STATES.MAIN;
      }

      LoadingData.time += 0.01;
      break;
  }

}

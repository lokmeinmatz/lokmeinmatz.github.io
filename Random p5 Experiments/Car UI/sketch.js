
function keyPressed(){
  if(keyCode == UP_ARROW)saveCanvas("wallpaper", "png");
}

const stepTime = 0.01

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

let MainUI = {
  time : 0,
  speed : 0,
  rpm : 0,
  targetRPM : 500,
  draw: function() {
    this.time += stepTime
    this.rpm += (this.targetRPM - this.rpm) * 0.05
    this.targetRPM = 500 + random(-60, 60)

    
    this.speed = (sin(this.time) + 1) * 100


    


    //text
    fill(min(255, this.time * 255))
    noStroke()
    textAlign(CENTER)
    textSize(80)
    let speedText = this.speed.toFixed(1)
    text(speedText, width/2, height/2)
    let sTW = textWidth(speedText)
    textSize(30)
    text("km", width/2 + sTW * 0.7, height/2 - 30)
    text("h", width/2 + sTW * 0.7, height/2 - 0)
    stroke(min(255, this.time * 255))
    line(width/2 + sTW * 0.55, height/2 - 26, width/2 + sTW * 0.85, height/2 - 26)


    //gang


    //draw Speed arc
    noFill()
    //stroke(map(this.speed, 0, 230, 0, 255), map(this.speed, 0, 230, 255, 0), 50)
    
    stroke(50, 60, 240)
    strokeWeight(10)
    let speedAngle = map(this.speed, 0, 230, PI - 0.2, TWO_PI + 0.2)
    strokeCap(SQUARE);
    arc(width/2, height/2, height/1.5 - 11, height/1.5 - 11, PI - 0.2, speedAngle)
    push()
    translate(width/2, height/2)
    rotate(speedAngle)
    line(height/3 - 1, 0, height/3 - 30, 0)
    pop()

    //Draw RPM arc
    noFill()
    stroke(map(this.rpm, 0, 7000, 0, 255), map(this.rpm, 0, 7000, 255, 0), 50)
    
    //stroke(50, 60, 240)
    strokeWeight(10)
    let rpmAngle = map(this.rpm, 0, 7000, PI - 0.2, TWO_PI + 0.2)

    strokeCap(SQUARE);
    arc(width/2, height/2, height/1.5 + 11, height/1.5 + 11, PI - 0.2, rpmAngle)
    push()
    translate(width/2, height/2)
    rotate(rpmAngle)
    line(height/3 + 1, 0, height/3 + 30, 0)
    pop()


    //normal arc
    noFill()
    stroke(255)
    strokeWeight(3)
    strokeCap(ROUND)
    arc(width/2, height/2, height/1.5, height/1.5, PI - 0.2, TWO_PI + 0.2)
  }
}

let LoadingData = {
  time: 0.0,
};

function draw() {
  background(0);
  
  switch(state){
    case STATES.LOADING:

      noFill();
      stroke(255);

      if(LoadingData.time < 1.0){
        strokeWeight(3);
        arc(width/2, height/2, 200, 200, 0, TWO_PI * LoadingData.time);
      }
      else if(LoadingData.time < 1.5){
        strokeWeight(3);
        ellipse(width/2, height/2, 200);
        //draw left line
        strokeWeight(sin(LoadingData.time*5)*2+5);
        line(width/2 - 150, height/2 - 20, width/2 - map(LoadingData.time, 1.0, 1.5, 150, -30), height/2 - 20);
      }
      else if(LoadingData.time < 2.0){
        strokeWeight(3);
        ellipse(width/2, height/2, 200);
        //draw left line
        strokeWeight(sin(LoadingData.time*5)*2+5);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 +30, height/2 - 20);
        //draw diagonal line
        line(width/2 +30, height/2 - 20, width/2 - map(LoadingData.time, 1.5, 2.0, -30, 30), height/2 - map(LoadingData.time, 1.5, 2.0, 20, -20));
      }

      else if(LoadingData.time < 2.5){
        strokeWeight(3);
        ellipse(width/2, height/2, 200);
        //draw left line
        strokeWeight(sin(LoadingData.time*5)*2+5);
        //draw left line
        line(width/2 - 150, height/2 - 20, width/2 +30, height/2 - 20);
        //draw diagonal line
        line(width/2 +30, height/2 - 20, width/2 - 30, height/2 + 20);
        //draw right line
        line(width/2 - 30, height/2 + 20, width/2 + map(LoadingData.time, 2.0, 2.5, -30, 150), height/2 + 20);

      }
      else if(LoadingData.time < 7){

        strokeWeight(3);
        ellipse(width/2, height/2, 200);
        //draw left line
        strokeWeight(sin(LoadingData.time*5)*2+5);
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

        strokeWeight(3);
        let first = map(LoadingData.time, 7, 7.5, PI / 2, PI - 0.2)
        let second = map(LoadingData.time, 7, 7.5, PI / 2 + TWO_PI, TWO_PI + 0.2)
        let d = map(LoadingData.time, 7, 7.5, 200, height/1.5)
        //arc(width/2, height/2, height/1.5, height/1.5, PI - 0.2, TWO_PI + 0.2)
        arc(width/2, height/2, d, d, first, second)

        strokeWeight((sin(LoadingData.time*5)*2+5) * map(LoadingData.time, 7.0, 7.5, 1.0, 0.0));
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

      LoadingData.time += stepTime * 2;
      break;
    case STATES.MAIN:

    MainUI.draw()
      
      break;
  }



}

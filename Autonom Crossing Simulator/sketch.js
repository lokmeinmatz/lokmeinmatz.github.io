let ism;
const maxSpeed = 3;

function setup() {
  createCanvas(1000, 1000);
  angleMode(DEGREES);


  p5.Vector.prototype.inWindow = function () {
    return(this.x >= 0 && this.x <= width && this.y >= 0 && this.y <= height);
  };


  let l1 = new Lane(1, new p5.Vector(10, 200), 15);
  let l2 = new Lane(1, new p5.Vector(10, 800), -75);


  ism = new IntersectionManager([l1, l2]);
}

function LaneIntersect(l1, l2){
  let A1 = l1.pos2.y - l1.pos1.y,
      B1 = l1.pos1.x - l1.pos2.x,
      C1 = A1 * l1.pos1.x + B1 * l1.pos1.y;
  let A2 = l2.pos2.y - l2.pos1.y,
      B2 = l2.pos1.x - l2.pos2.x,
      C2 = A2 * l2.pos1.x + B2 * l2.pos1.y;
  let denominator = A1 * B2 - A2 * B1;
  if(denominator == 0)return null;
  return {
    x: (B2 * C1 - B1 * C2) / denominator,
    y: (A1 * C2 - A2 * C1) / denominator,
  };
}

function keyPressed() {
  if(keyCode == 83){
    ism.spawnNewCar();
  }
}

function draw() {
  clear();

  ism.update();
  ism.draw();

}



function IntersectionManager(lanes){
  this.cars = [];
  this.lanes = lanes;

  //todo calculate collision points
  this.collisionPoints = [];
  //get all collision points
  for(let i = 0; i < this.lanes.length - 1; i++){
    for(let j = i + 1; j < this.lanes.length; j++){
      let collision = LaneIntersect(this.lanes[i], this.lanes[j]);
      if(collision != null){
        collision.lane1 = this.lanes[i];
        collision.lane2 = this.lanes[j];
        this.collisionPoints.push(collision);
      }
    }
  }

  this.update = function(){
    for(let i = 0; i < this.cars.length; i++){
      this.cars[i].update();
    }
  }

  this.draw = function(){
    for(let i = 0; i < this.lanes.length; i++){
      this.lanes[i].draw();
    }

    for(let i = 0; i < this.cars.length; i++){
      this.cars[i].draw();
    }
    fill(150, 150, 200);
    for(let i = 0; i < this.collisionPoints.length; i++){
      let colp = this.collisionPoints[i];
      ellipse(colp.x, colp.y, 10);
    }
  }

  this.spawnNewCar = function(){
    let laneIndex = floor(random(this.lanes.length));
    let car = new Car(this.lanes[laneIndex], 2, maxSpeed, maxSpeed);
    this.cars.push(car);
  }
}


function Lane(id, pos, heading){
  this.pos1 = pos;
  this.pos2 = pos.copy();
  this.heading = heading;
  this.id = id;

  this.cars = [];

  this.headingVec = new p5.Vector(1, 0).rotate(radians(this.heading));
  while(this.pos1.inWindow()){
    if(Math.abs(heading) < 90)this.pos1.sub(this.headingVec);
    else this.pos1.add(this.headingVec);
  }

  while(this.pos2.inWindow()){
    if(Math.abs(heading) > 90)this.pos2.sub(this.headingVec);
    else this.pos2.add(this.headingVec);
  }

  this.draw = function(){
    stroke(0, 200, 0);
    line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
  };
}

function Car(startLane, targetLane, speed, maxSpeed){

  this.startLane = startLane;
  this.targetLane = targetLane;
  this.length = 50;
  this.width = 20;

  this.position = this.startLane.pos1.copy();
  this.dir = this.startLane.heading;
  this.acc = 0;
  this.steering = 0;

  this.speed = speed;
  this.maxSpeed = maxSpeed;

  this.update = function(){
    this.dir += this.steering * 0.03;
    this.speed += this.acc * 0.03;
    let vel = new p5.Vector(this.speed, 0);
    vel.rotate(radians(this.dir));
    this.position.add(vel);
  }
  this.draw = function(){
    push();
    fill(100, 200, 100);
    noStroke();
    translate(this.position.x, this.position.y);
    rotate(this.dir);
    rect(-this.length/2, -this.width/2, this.length, this.width);
    stroke(250, 0, 0);
    line(0, 0, this.length + this.steering, 0);
    pop();
  }
}

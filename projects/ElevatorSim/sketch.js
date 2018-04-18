const floorSpacing = 100;
const floorOffset = 100;
const floorCount = 8;

let nextActionCounter = 40;

class Floor {
  constructor(index){
    this.index = index;
    this.queue = [];
  }

  draw(){
    push();
    translate(width/2, map(this.index, 0, floorCount-1, floorOffset, floorOffset + floorSpacing * floorCount))
    //draw floor
    stroke(0);
    strokeWeight(2);
    line(-10, 0, 170, 0);
    //draw waiting persons
    noStroke();
    text("People waiting: "+this.queue.length, 180, 0);
    pop();

    //update pos of people in queue
    for(let i = 0; i < this.queue.length; i++){
      this.queue[i].pos.x = width/2 - 50 - (i * 30);
    }
  }

  addPerson(p){
    this.queue.push(p);
    elevator.calls.push(this.index);
  }
}
const maxPersonsElevator = 10;

let passedPersons = 0;
let OverallWaitingTime = 0;

class Elevator {



  constructor(){
    this.vSpeed = 0;
    this.dir = 1;
    this.currentFloor = 0;
    this.people = [];
    this.calls = [];
    this.targetFloor = 2;
  }

  draw(){



    this.currentFloor += this.vSpeed;

    //allign persons in elevator
    for(let i = 0; i < this.people.length; i++){
      let currentp = this.people[i];
      currentp.pos.x = width/2 + 30 + i * 15;
      currentp.currentFloor = this.currentFloor;
    }
    //check to wich floor we have to travel next
    this.vSpeed = this.targetFloor - this.currentFloor;
    this.vSpeed = constrain(this.vSpeed, -0.05, 0.05);



    if(abs(this.vSpeed * 100) < 0.1 && nextActionCounter < 1){
      nextActionCounter = 50;
      let personLeft = false;
      //elevator stopped in floor, let people out
      for(let i = 0; i < this.people.length; i++){
        if(this.people[i].targetFloor == this.targetFloor){
          //let person exit
          this.people[i].pos.x = width + 30;
          this.people[i].inElevator = false;

          OverallWaitingTime += frameCount - this.people[i].startFrame;
          passedPersons++;

          this.people.splice(i, 1);
          personLeft = true;
          if(personCount < maxPersons) spawnPerson();
          break;
        }
      }

      if(!personLeft){

        //let persons enter elevator

        if(this.people.length < maxPersonsElevator && floors[this.targetFloor].queue.length > 0){
          let newp = floors[this.targetFloor].queue.shift();
          this.people.push(newp);
          this.calls.push(newp.targetFloor);
          newp.inElevator = true;
          console.log("person entered elevator");
        }
        else if(this.calls.length > 0){

          //sort calls by distace and direction
          this.calls.sort((a, b) => {
          	if(a <= this.currentFloor && b <= this.currentFloor)return (b - this.currentFloor) - (a - this.currentFloor);
            if(a >= this.currentFloor && b >= this.currentFloor)return (a - this.currentFloor) - (b - this.currentFloor);
          	return (b - this.currentFloor) * this.dir - (a - this.currentFloor) * this.dir;
          });

          //remove all other calls from thos floor
          for(let i = 0; i < this.calls.length; i++){
            if(this.calls[i] == this.targetFloor){
              this.calls.splice(i, 1);
              i--;
            }

          }

          this.dir = Math.sign(this.calls[0] - this.currentFloor);


          console.log("Direction: ", this.dir);

          //get to next called floor
          this.targetFloor = this.calls.shift();
          console.log("new floor: ", this.targetFloor);

        }

      }

    }

    //draw
    stroke(0);
    fill(150);
    rect(width/2, map(this.currentFloor, 0, floorCount-1, floorOffset - 100, floorOffset + floorSpacing * floorCount - 100), 150, 100);
  }

}

class Person {


  constructor() {
    this.currentFloor = floor(random(floorCount));
    this.pos = new p5.Vector(width/3, height/2);

    this.currentPos = this.pos.copy();
    colorMode(HSB);
    this.color = color(random(360), 50, 90);
    colorMode(RGB);
    this.startFrame = frameCount;
    this.inElevator = false;
    do {
      this.targetFloor = floor(random(floorCount));
    } while (this.targetFloor == this.currentFloor);

  }

  draw(){
    this.currentPos = p5.Vector.lerp(this.currentPos, this.pos, 0.05);
    if(this.inElevator){
      this.currentPos.y = this.pos.y;
      //no smoothing in y axis
    }

    stroke(0);
    this.pos.y = map(this.currentFloor, 0, floorCount-1, floorOffset, floorOffset + floorSpacing * floorCount);
    fill(this.color);
    ellipse(this.currentPos.x , this.currentPos.y - 20, 30, 40);


    //draw head
    fill(255,224,189);
    ellipse(this.currentPos.x , this.currentPos.y - 40, 20);

    //draw uneccesary facial things
    fill(0);
    ellipse(this.currentPos.x + 5 , this.currentPos.y - 40, 3);
    ellipse(this.currentPos.x - 5 , this.currentPos.y - 40, 3);

    //nose
    line(this.currentPos.x, this.currentPos.y - 40, this.currentPos.x, this.currentPos.y - 35);

    //check if mouse is on persons
    if(MouseNear(this.currentPos)){
      this.drawInfoBox();
    }
  }

  drawInfoBox(){

    push();
    fill(255);
    translate(this.currentPos.x - 120, this.currentPos.y - 140);
    rect(0, 0, 240, 80, 10);
    noStroke();
    fill(20);
    text("From: "+this.currentFloor+" -> To: "+this.targetFloor, 10, 15);


    pop();
  }
}


let elevator = new Elevator();
const maxPersons = 100;
let personCount = 0;
function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);
  for(let i = 0; i < 10; i++)spawnPerson();
}

function spawnPerson(){
  personCount++;
  let p = new Person();
  floors[p.currentFloor].addPerson(p);
  persons.push(p);
}

let persons = [];

let floors = [];

for(let i = 0; i < floorCount; i++){
  floors.push(new Floor(i));
}

function draw() {
  nextActionCounter--;
  background(50, 40, 60);



  elevator.draw();

  for(let i = 0; i < persons.length; i++){
    persons[i].draw();

    if(persons[i].currentPos.x > width + 10){
      //remove person
      persons.splice(i, 1);
      i--;
    }
  }

  for(let i = 0; i < floors.length; i++){
    floors[i].draw();
  }


  if(passedPersons > 0){
    push();
    textSize(20);
    noStroke();
    fill(255);
    text("Average Time: "+(OverallWaitingTime / (passedPersons * 60)), width - 500, height - 100);
    pop();
  }
}

function MouseNear(pos){
  if(mouseX > pos.x - 15 && mouseX < pos.x + 15 && mouseY > pos.y - 60 && mouseY < pos.y){
    return true;
  }
  return false;
}

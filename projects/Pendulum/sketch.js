class Point {
  constructor(x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
    this.oldX = x;
    this.oldY = y;
    this.oldZ = z;
    this.fixed = false;
    console.log(this);
  }
}

let trail;
const scale = 4;

function setup() {
  createCanvas(1000 * scale, 1000 * scale);
  sticks = [
    {p0: points[0], p1: points[1], distance: dist(points[0].X, points[0].Y, points[0].Z, points[1].X, points[1].Y, points[1].Z)},
  ];
  trail = createGraphics(width, height);
  trail.translate(width/2, height/2);
  trail.noStroke();
  trail.background(20);
  trail.fill(100, 200, 250);
  //noLoop();
}

var points = [
  new Point(0, 0, 2000*scale),
  new Point(100*scale, 300*scale, 0)
];

points[0].fixed = true;
points[1].oldX += 0.4;
points[1].oldY -= 0.1;

var sticks = [];

const gravity = 0.007;

function draw() {
  clear();

  for(let upf = 0; upf < 50; upf++){
    updatePoints();
    for(let i = 0; i < 10; i++){
      updateSticks();
    }
    //draw second point to offset canvas
    
    trail.ellipse(points[1].X, points[1].Y, scale*5);
  }
  
  image(trail, 0, 0);
  translate(width/2, height/2);
  renderSticks();
  renderPoints();
}

function keyTyped() {
  if(key == "s") {
    saveCanvas(trail, String(new Date().getTime()), "png");
  }
}

function updatePoints() {
  for(let i = 0; i < points.length; i++){
    let p = points[i],
        vx = p.X - p.oldX,
        vy = p.Y - p.oldY;
        vz = p.Z - p.oldZ;
    
        let v = sqrt(vx*vx + vy*vy + vz*vz);
        trail.fill(constrain(v*100, 0, 255), constrain(v*200, 0, 255), constrain(400 - v*200, 0, 255));
    if(!p.fixed){

      p.oldX = p.X;
      p.oldY = p.Y;
      p.oldZ = p.Z;

      p.X += vx;
      p.Y += vy;
      p.Z += vz - gravity;
    }
  }
}

function renderPoints() {
  noStroke();
  fill(0);
  for(let i = 0; i < points.length; i++){
    let p = points[i];
    ellipse(p.X, p.Y, 10);
  }
}

function updateSticks() {
  for(let i = 0; i < sticks.length; i++){
    let s = sticks[i],
        dx = s.p1.X - s.p0.X,
        dy = s.p1.Y - s.p0.Y,
        dz = s.p1.Z - s.p0.Z,
        distance = sqrt(dx * dx + dy * dy + dz * dz),
        
        difference = s.distance - distance,
        percent = difference / distance / 2;
    dx *= percent;
    dy *= percent;
    dz *= percent;
    
    let fac = (s.p0.fixed || s.p1.fixed)?1:0 + 1;
    if(!s.p0.fixed){
      s.p0.X -= dx * fac;
      s.p0.Y -= dy * fac;
      s.p0.Z -= dz * fac;
    }
    if(!s.p1.fixed){
      s.p1.X += dx * fac;
      s.p1.Y += dy * fac;
      s.p1.Z += dz * fac;
    }


  }
}


function renderSticks(){
  stroke(0);
  noFill();
  for(let i = 0; i < sticks.length; i++){
    let s = sticks[i],
        p0 = s.p0,
        p1 = s.p1;
        line(p0.X, p0.Y, p1.X, p1.Y);
  }
}

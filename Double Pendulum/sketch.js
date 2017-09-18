function setup() {
  createCanvas(1000, 1000);
  sticks = [
    {p0: points[0], p1: points[1], distance: dist(points[0].x, points[0].y, points[1].x, points[1].y)},
    {p0: points[1], p1: points[2], distance: dist(points[1].x, points[1].y, points[2].x, points[2].y)},
  ];
}

var points = [
  {x: 500, y: 500, oldx: 500, oldy: 500, fixed: true},
  {x: 700, y: 650, oldx: 650, oldy: 650, fixed: false},
  {x: 800, y: 500, oldx: 800, oldy: 500, fixed: false},
];

var sticks = [];

const gravity = 0.3;

function draw() {
  clear();
  updatePoints();
  updateSticks();
  renderSticks();
  renderPoints();

}

function updatePoints() {
  for(let i = 0; i < points.length; i++){
    let p = points[i],
        vx = p.x - p.oldx,
        vy = p.y - p.oldy;
    if(!p.fixed){

      p.oldx = p.x;
      p.oldy = p.y;

      p.x += vx;
      p.y += vy;
      p.y += gravity;
    }
  }
}

function renderPoints() {
  noStroke();
  fill(0);
  for(let i = 0; i < points.length; i++){
    let p = points[i];
    ellipse(p.x, p.y, 10);
  }
}

function updateSticks() {
  for(let i = 0; i < sticks.length; i++){
    let s = sticks[i],
        dx = s.p1.x - s.p0.x,
        dy = s.p1.y - s.p0.y,
        distance = sqrt(dx * dx + dy * dy),
        difference = s.distance - distance,
        percent = difference / distance / 2;
    dx *= percent;
    dy *= percent;

    let fac = (s.p0.fixed || s.p1.fixed)?1:0 + 1;
    if(!s.p0.fixed){
      s.p0.x -= dx * fac;
      s.p0.y -= dy * fac;
    }
    if(!s.p1.fixed){
      s.p1.x += dx * fac;
      s.p1.y += dy * fac;
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
        line(p0.x, p0.y, p1.x, p1.y);
  }
}

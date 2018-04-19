let worldMeshes = [];
let lightMesh;


function setup() {
  createCanvas(1800, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  angleMode(DEGREES);


  //canvas border
  worldMeshes.push(new Mesh([createVector(10, 10), createVector(width-10, 10), createVector(width-10, height-10), createVector(10, height-10)],
  [[0, 1], [1, 2], [2, 3], [3, 0]], [0, 1, 2, 3], color(255, 50, 0)));

  worldMeshes.push(new Mesh([createVector(100, 100), createVector(300, 100), createVector(300, 300), createVector(100, 300)],
  [[0, 1], [1, 2], [2, 3], [3, 0]], [0, 1, 2, 3], color(255, 50, 0)));
  //create random mesh
  let randpoints = [];
  let randedges = [];
  for(let i = 0; i < 10; i++) {
    randpoints.push(createVector(random(500, 1400), random(200, 700)));
    randpoints.push(createVector(random(500, 1400), random(200, 700)));
    randedges.push([(i*2), (i*2)+1]);
  }
  worldMeshes.push(new Mesh(randpoints, randedges, [], color(255, 50, 0)));

  //create small mesh row
  for(let i = 0; i < 15; i++) {
    worldMeshes.push(new Mesh([createVector(1000 + i*50, 800), createVector(1020 + i*50, 800), createVector(1020 + i*50, 820), createVector(1000 + i*50, 820)],
    [[1, 2], [2, 3], [3, 0]], [0, 1, 2, 3], color(255, 50, i * 10)));
  }

  lightMesh = new Mesh([], [], [], color(240, 230, 210));
}



//return vector with intersection point
function segmentIntersection(l1, l2) {

  function cross2d(v1, v2) {
    return v1.x*v2.y - v1.y*v2.x;
  }

  let rxs = cross2d(l1.direction, l2.direction);

  let t1 = cross2d(p5.Vector.sub(l2.origin, l1.origin), l2.direction) / rxs;

  let t2 = cross2d(p5.Vector.sub(l2.origin, l1.origin), l1.direction) / rxs;

  if (t1 <= 0 || t2 < 0 || t2 > 1) {
    return null;
  }
  //TODO check if t1 and t2 in range
  return {intersect:createVector(l1.origin.x + l1.direction.x * t1, l1.origin.y + l1.direction.y * t1), t:t1};

}

function getClosestIntersection(line) {
  let closestIntersection = {intersect:createVector(0, 0), t:1000000};
  
  for(let worldMesh of worldMeshes) {
    for(let edge of worldMesh.edges) {
      let p1 = worldMesh.points[edge[0]];
      let p2 = worldMesh.points[edge[1]];

      let intersect = segmentIntersection(line, new Line(p1, p5.Vector.sub(p2, p1)));
      if(intersect == null) {continue}
      if(intersect.t < closestIntersection.t) {
        closestIntersection = intersect;
      }
    }
  }

  return closestIntersection;
}

const raysPerDeg = 1;
function calculateLightMesh_Raycast(lamp) {
  let points = [];
  let faces = [];
  
  points.push(lamp.copy());
  //raycasts for all in 360°
  
  for (let deg = 0; deg <= 360*raysPerDeg; deg++) {
    //ray
    let dir = createVector(cos(deg/raysPerDeg), sin(deg/raysPerDeg));
    let line = new Line(lamp, dir);
    
    let closestIntersection = getClosestIntersection(line);
    //add point to mesh
    //console.log(closestIntersection);
    points.push(closestIntersection.intersect);
    faces.push([0, points.length - 1, points.length]);
  }

  //set last edge point to 0 -> circle is closed
  faces[faces.length - 1][2] = 0;

  lightMesh.points = points;
  lightMesh.faces = faces;
}



const OFFSETANGLE = 0.1;

function calculateLightMesh(lamp) {
  let points = [];
  let faces = [];
  
  let intersections = []; //Sort intersections by angle for mesh
  for(let worldMesh of worldMeshes) {
    for(let point of worldMesh.points) {
      //ray

      //3 casts, -offsetangle, 0, +offsetangle
      let dir = createVector(point.x - lamp.x, point.y - lamp.y);

      for(let o = -1; o <= 1; o++) {
        let line = new Line(lamp, dir.copy().rotate(OFFSETANGLE * o));
        
        let closestIntersection = getClosestIntersection(line);
        
        //add point to mesh
        //console.log(closestIntersection);
        intersections.push({angle:dir.heading(), point:closestIntersection.intersect});
      }

      

     
    }
  }

  //sort intersections by angle
  intersections.sort((a,b) => a.angle > b.angle);
  points[0] = lamp.copy();
  //copy intersections to points adn create edges
  for(let i = 0; i < intersections.length; i++) {
    points[i+1] = intersections[i].point;
    faces[i] = [0, i+1, i+2];
  }
  faces[faces.length-1] [2] = 1;


  lightMesh.points = points;
  lightMesh.faces = faces;
}


function draw() {
  background(0);
  //calculate lamp pos
  let mouse = createVector(mouseX, mouseY);
  //let mouse = createVector(1200, 500);
  
  calculateLightMesh(mouse);
  
  for(let mesh of worldMeshes) {
    mesh.draw(DRAW_MODE.WIREFRAME);
    //console.log("Drawing mesh")
  }
  lightMesh.draw(DRAW_MODE.FLAT);


}

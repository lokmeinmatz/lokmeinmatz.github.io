let debug = true

function setup() {
  noCanvas()
  init()
}

const scene = new THREE.Scene()

class Ground {

  constructor() {
    this.cmesh = new Mesh([], [])

    //generate
    //verts : 50 -> 5, 25, 45 are bases (higher)
    const offsetScale = 30
    for(let i = 0; i < 50; i++) {
      let offset = 0
      if(i <= 5) {
        offset = Math.tanh(i - 3) * -offsetScale
      }
      else if(i <= 15) {
        offset = Math.tanh(-i + 7) * -offsetScale
      }
      else if(i <= 25) {
        offset = Math.tanh(i - 23) * -offsetScale
      }
      else if(i <= 35) {
        offset = Math.tanh(-i + 27) * -offsetScale
      }
      else if(i <= 45) {
        offset = Math.tanh(i - 43) * -offsetScale
      }
      else {
        offset = Math.tanh(-i + 47) * -offsetScale
      }
      this.cmesh.points[i] = createVector(map(i, 0, 49, 0, width), height - 100 - noise(i * 0.5) * 10 + offset)
      if(i < 49) {
        this.cmesh.edges[i] = [i, i+1]
      }
    }


    //points: only top row -> triangulation simpler
    //construct own THREEjs Mesh
    let THREEgeometry = new THREE.Geometry()
    THREEgeometry.faceVertexUvs = [[]]
    for(let i = 0; i < this.cmesh.points.length; i++) {
        //create top and bottom point
        let cmp = this.cmesh.points[i]
        THREEgeometry.vertices.push(new THREE.Vector3(cmp.x, cmp.y, 0))   
        THREEgeometry.vertices.push(new THREE.Vector3(cmp.x, height, 0))


        if(i > 0) {
          //add faces
          

          let fi = i*2 - 2

          //create first face (0, 1, 2)
          THREEgeometry.faces.push(new THREE.Face3( fi + 0, fi + 1, fi + 2 ))

          //create second face (1, 3, 2)
          THREEgeometry.faces.push(new THREE.Face3( fi + 1, fi + 3, fi + 2 ))  

          //create UVs
          // add uvs

          //tri 1
          const scale = 1/width


          //get vectors
          let thisTop = THREEgeometry.vertices[fi + 2]
          let thisBot = THREEgeometry.vertices[fi + 3]
          let lastTop = THREEgeometry.vertices[fi + 0]
          let lastBot = THREEgeometry.vertices[fi + 1]

          let thisX = thisTop.x * scale
          let thisY = thisTop.y * scale
          let lastX = lastTop.x * scale
          let lastY = lastTop.y * scale
          console.log(thisX, thisY)

          //test

          
          THREEgeometry.faceVertexUvs[0].push( [
            new THREE.Vector2( lastX, lastY ),
            new THREE.Vector2( lastX, 1 ),
            new THREE.Vector2( thisX, thisY )
          ] )

          //tri 2
        
          THREEgeometry.faceVertexUvs[0].push( [
            new THREE.Vector2( lastX, 1 ),
            new THREE.Vector2( thisX, 1 ),
            new THREE.Vector2( thisX, thisY )
          ] )
        }
    }
    
    

    this.THREEobj = new THREE.Mesh(THREEgeometry, new THREE.MeshBasicMaterial())
    //this.THREEobj = new THREE.Mesh(THREEgeometry, new THREE.PointsMaterial())
    scene.add(this.THREEobj)
    console.log(this.THREEobj.material)
    this.THREEobj.material.map = new THREE.TextureLoader().load( "imgs/dirt.jpg" );
    this.THREEobj.material.map.wrapS = this.THREEobj.material.map.wrapT = THREE.RepeatWrapping;
  }

  draw() {
    //this.cmesh.draw()
  }

}

class City {
  constructor(pos) {
    this.pos = pos
    this.bombed = false
    //todo texture variance???
  }

  draw() {
    if(debug) {
      stroke(255)
      noFill()
      rect(this.pos.x - 32, this.pos.y - 64, 64, 64)
    }
  }


}

class AMB /* Anti-Missile Battery */ {
  constructor(pos) {
    this.pos = pos
    this.missiles = 10
    this.destroyed = false

    //calculate center of gun
    this.gunPos = pos.copy()
    this.gunPos.y -= 30

  }

  draw(aim) {
    //Draw base


    //vec to mouse
    let aimVec = aim.copy().sub(this.gunPos).normalize().mult(30)


    if(debug) {
      noFill()
      stroke(255)
      rect(this.pos.x - 16, this.pos.y - 32, 32, 32)
      line(this.gunPos.x, this.gunPos.y, this.gunPos.x + aimVec.x, this.gunPos.y + aimVec.y)
    }
    stroke(75, 83, 32)
    push()
    translate(this.gunPos.x, this.gunPos.y)
    rotate(aimVec.heading() - 90)
    rect(-2, 0, 4, 15)
    pop()

    fill(120, 100, 50)
    for(let i = 0; i < this.missiles; i++) {
      rect(this.pos.x - 4, this.pos.y + 4 + (i*10), 8, 4)
      
    }

  }
}

class Particle {
  constructor(pos, dir, variance) {
    this.pos = pos
    this.age = 0
    this.lifetime = random(20, 60)
    this.dir = dir.copy().mult(2).add(p5.Vector.random2D().mult(random() * variance))
    this.angle = random(0, 360)
    this.angvel = random(-1, 1)
  }

  draw() {
    this.age ++

    this.pos.add(this.dir)
    this.dir.mult(0.99)
    this.angle += this.angvel
    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.angle)
    noStroke()
    let size = this.age / this.lifetime
    fill(map(size, 0, 1, 255, 50), map(size, 0, 1, 100, 50), 50, 255 - size * 255)
    const scale = 10
    rect(- size * scale, - size * scale, scale * size * 2, scale * size * 2)
    pop()

  }
}

class Explosion {
  constructor(pos) {
    this.pos = pos
    this.radius = 0
    this.time = 0
    this.lifetime = 70 //half
  }

  draw() {
    this.time ++

    this.radius = random(50, 60)  
    this.radius *= -(1/(this.lifetime * this.lifetime)) * Math.pow(this.time - this.lifetime, 2) + 1
    noStroke()
    let fac = this.time / (this.lifetime * 2)
    fill(255 - 200 * fac, 100 - 100 * fac + 50, 50 * fac)
    ellipse(this.pos.x, this.pos.y, this.radius*2)
  }
}

let particles = []
let missiles = []
let counterMissiles = []
let explosions = []
let missileMap

class CounterMissile {
  constructor(pos, goal, speed) {
    this.pos = pos
    this.goal = goal
    this.speed = speed
    this.exploded = false
  }

  draw() {
    this.speed += 0.04
    this.speed *= 0.98
    let vtg = p5.Vector.sub(this.goal, this.pos)
    let vtgnormalized = vtg.copy().normalize()
    stroke(255, 0, 0)
    push()
    translate(this.pos.x, this.pos.y)
    rotate(vtgnormalized.heading() + 90)
    rect(-2, -5, 4, 10)
    pop()
    this.pos.add(vtgnormalized.mult(this.speed))
    particles.push(new Particle(this.pos.copy().sub(vtgnormalized.copy().mult(5)), vtgnormalized.copy().mult(-2), 2/(1+this.speed)))
    if(p5.Vector.dist(this.pos, this.goal) < this.speed) {
      //at goal
      console.log("BOOOOOOOM")
      this.exploded = true

      //create Explosion
      explosions.push(new Explosion(this.pos))
    }
  }
}

class Missile {
  constructor(speed) {
    this.pos = createVector(random(width), -10)
    //select random impact point
    let ip = random(width)
    this.speed = speed
    this.dir = createVector(ip, height - 10).sub(this.pos).normalize().mult(speed)

    //precalculate imapct point -> no collision detection every frame
    //collisiondetection
    let rcast = getClosestIntersection(new Line(this.pos.copy(), this.dir.copy()), ground.cmesh)
    this.impactPoint = rcast.intersect


    this.destroyed = false
  }

  draw() {
    this.pos.add(this.dir)
    stroke(200, 230, 100)
    push()
    translate(this.pos.x, this.pos.y)
    rotate(this.dir.heading() + 90)
    rect(-2, -5, 4, 10)
    pop()
    missileMap.stroke(250, 150, 50)
    missileMap.line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y)
    particles.push(new Particle(this.pos.copy(), this.dir.copy().mult(-1), 1))

    //collisiondetection
    //with dist^2 for better performance
    if((this.pos.x - this.impactPoint.x) * (this.pos.x - this.impactPoint.x) + (this.pos.y - this.impactPoint.y) * (this.pos.y - this.impactPoint.y) <= this.speed * this.speed) {
      console.log(rcast)
      this.destroyed = true
    }
  }
}


let ground
let cities = []
let ambs = []
let cooldown = 0

function windowResized() {
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  let windowRatio = window.innerwidth / window.innerheight
  let canvasRatio = width / height
  if(windowRatio < canvasRatio) {
    canvasstyle.width = "100vw";
    canvasstyle.height = "auto";
  }
  else {
    canvasstyle.width = "auto";
    canvasstyle.height = "100vh";
  }
}

const width = 400*2
const height = 300*2


var cam, renderer
function init() {
  
  
  cam = new THREE.OrthographicCamera(0, width, 0, height, 0.1, 1000)
  cam.position.z += 10
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  document.body.appendChild(renderer.domElement) 


  windowResized()
  
  
  
  ground = new Ground()

  //populate cities
  for(let i = 0; i < 6; i++) {
    let i_n = i + 2
    if( i >= 3) {i_n += 2}
    let xpos = map(i_n, 0, 11, 0, width) //wrong way -> clustered cities
    //Raycast to get terrain height
    let rcast = getClosestIntersection(new Line(createVector(xpos, 0), createVector(0, 1)), ground.cmesh)
    let ypos = rcast.intersect.y + 3
    cities[i] = new City(createVector(xpos, ypos))
  }

  //populate AMBs
  for(let i = 0; i < 3; i++) {
    let xpos = 0
    switch (i) {
      case 0:
          xpos = ground.cmesh.points[5].x
        break;

      case 1:
        xpos = ground.cmesh.points[25].x
        break;

      case 2:
        xpos = ground.cmesh.points[45].x
        break;
    
      default:
        break;
    }


    //Raycast to get terrain height
    let rcast = getClosestIntersection(new Line(createVector(xpos, 0), createVector(0, 1)), ground.cmesh)
    let ypos = rcast.intersect.y + 3
    ambs[i] = new AMB(createVector(xpos, ypos))

    
  }

  missileMap = createGraphics(width, height)

  update()
}

let remainingMissiles = 1

function update() {

  if(remainingMissiles > 0 && frameCount % 200 == 0) {
    missiles.push(new Missile(1.5))
    remainingMissiles --
  }

  //input
  //TODO countdown
  cooldown --
  let mouseVec = createVector(mouseX, mouseY)
  mouseVec.y = constrain(mouseVec.y, 0, height - 220)
  if(mouseIsPressed && cooldown <= 0) {
    cooldown = 20
    //get closest amb
    let cambi = 0
    for(let i = 0; i < 3; i++) {
      if(p5.Vector.dist(mouseVec, ambs[i].pos) < p5.Vector.dist(mouseVec, ambs[cambi].pos) && ambs[i].missiles > 0) {
        cambi = i
      }
    }
    if(ambs[cambi].missiles <= 0) {return}
    //fire from closest
    ambs[cambi].missiles --
    counterMissiles.push(new CounterMissile(ambs[cambi].gunPos.copy(), mouseVec.copy(), 0.2))
  }
  
  background(100, 150, 255);

  image(missileMap, 0, 0, width, height)

  //draw floor
  ground.draw()

  //Draw cities
  for(let city of cities) {
    city.draw()
  }


  //draw Particles
  for(let i = 0; i < particles.length; i++) {
    particles[i].draw()
    if(particles[i].age > particles[i].lifetime) {
      particles.splice(i, 1)
      i--
    }
  }

  //draw Missiles
  for(let i = 0; i < missiles.length; i++) {
    missiles[i].draw()
    if(missiles[i].destroyed) {
      missiles.splice(i, 1)
      i--
    }
  }
  
  for(let amb of ambs) {
    amb.draw(mouseVec)
  }

  for(let countermissile of counterMissiles) {
    countermissile.draw()
  }

  for(let i = 0; i < counterMissiles.length; i++) {
    counterMissiles[i].draw()
    if(counterMissiles[i].exploded) {
      counterMissiles.splice(i, 1)
      i--
    }
  }

  //draw Explosions
  for(let i = 0; i < explosions.length; i++) {
    explosions[i].draw()

    //check collisions of missiles with explosion
    for(let j = 0; j < missiles.length; j++) {
      if(p5.Vector.dist(missiles[j].pos, explosions[i].pos) < explosions[i].radius) {
        //delete missile
        missiles.splice(j, 1)
        j--
      }
    }

    if(explosions[i].time > explosions[i].lifetime*2) {
      explosions.splice(i, 1)
      i--
    }
  }

  

  //UI
  fill(255)
  noStroke()
  textSize(10)

  text(frameRate().toFixed(2).toString(), 15, 40)
  if(frameRate() > 1 && frameRate() < 200) {
    dt = 1 / frameRate()
  }


  //Draw custom cursor
  noFill()
  stroke(255)
  let cx = mouseX, cy = mouseY
  rect(cx - 16, cy - 16, 32, 32)
  line(cx + 10, cy, cx + 20, cy)
  line(cx - 10, cy, cx - 20, cy)

  line(cx, cy + 10, cx, cy + 20)
  line(cx, cy - 10, cx, cy - 20)
  rect(mouseVec.x - 2, mouseVec.y - 2, 5, 5)

  if(debug) {
    line(0, height-220, width, height-220)
  }

  renderer.render(scene, cam)

  requestAnimationFrame(update)
}

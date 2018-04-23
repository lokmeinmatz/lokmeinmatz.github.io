let debug = true

function setup() {
  noCanvas()
  init()
}





const scene = new THREE.Scene()


let particles = []
let missiles = []
let counterMissiles = []
let explosions = []
let missileMap



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

const TexMap = new Map()

let PreviewSprite = new THREE.Sprite(new THREE.SpriteMaterial())

PreviewSprite.scale.set(300, 300, 1)
PreviewSprite.position.set(width/2, height/2, 3)
function EnablePreview(name) {
  scene.add(PreviewSprite)
  PreviewSprite.material.map = TexMap.get(name)
}

function DisablePreview() {
  scene.remove(PreviewSprite)
}

function init() {



  //LOAD TEXTURES
  TexMap.set("city", new THREE.TextureLoader().load( "imgs/city.png" ))
  TexMap.set("amb_base", new THREE.TextureLoader().load( "imgs/amb_base.png" ))
  TexMap.set("amb_gun", new THREE.TextureLoader().load( "imgs/amb_gun.png" ))
  TexMap.set("missile", new THREE.TextureLoader().load( "imgs/missile.png" ))
  TexMap.set("antiMissile", new THREE.TextureLoader().load( "imgs/antiMissile.png" ))
  TexMap.set("particle", new THREE.TextureLoader().load( "imgs/smoke.png" ))
  TexMap.set("explosion", new THREE.TextureLoader().load( "imgs/explosion.png" ))



  TexMap.set("cursor", new THREE.TextureLoader().load( "imgs/cursor.png" ))
  TexMap.set("cursor_aim", new THREE.TextureLoader().load( "imgs/cursor_aim.png" ))
  

  //TODO replace with background
  scene.background = new THREE.Color(0.5, 0.5, 0.5)

  cam = new THREE.OrthographicCamera(0, width, height, 0, 0.1, 1000)
  cam.position.z += 10
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  angleMode(RADIANS)
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
    let ypos = rcast.intersect.y + 20
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

  cursorSprite = new THREE.Sprite(new THREE.SpriteMaterial({map:TexMap.get("cursor")}))
  cursorSprite.scale.set(32, 32, 1)
  scene.add(cursorSprite)

  cursorAimSprite = new THREE.Sprite(new THREE.SpriteMaterial({map:TexMap.get("cursor_aim")}))
  cursorAimSprite.scale.set(32, 32, 1)
  scene.add(cursorAimSprite)

  update()
}

let cursorSprite, cursorAimSprite

let remainingMissiles = 1

function update() {

  if(remainingMissiles > 0 && frameCount % 200 == 0) {
    missiles.push(new Missile(1.5))
    remainingMissiles --
  }

  //input
  //TODO countdown
  cooldown --
  let mouseVec = createVector(Mouse.x, Mouse.y)
  mouseVec.y = constrain(mouseVec.y, 200, height)
  if(mouseIsPressed && cooldown <= 0) {
    cooldown = 50
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

  //TODO image(missileMap, 0, 0, width, height)

  

  //Draw cities
  for(let city of cities) {
    city.draw()
  }


  //draw Particles
  for(let i = 0; i < particles.length; i++) {
    particles[i].draw()
    if(particles[i].age > particles[i].lifetime) {
      scene.remove(particles[i].sprite)
      particles.splice(i, 1)
      i--
    }
  }

  //draw Missiles
  for(let i = 0; i < missiles.length; i++) {
    missiles[i].draw()
    if(missiles[i].destroyed) {
      missiles[i].remove()
      missiles.splice(i, 1)
      i--
    }
  }
  
  for(let amb of ambs) {
    amb.draw(mouseVec)
  }

 

  for(let i = 0; i < counterMissiles.length; i++) {
    counterMissiles[i].draw()
    if(counterMissiles[i].exploded) {
      counterMissiles[i].remove()
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
        missiles[j].remove()
        missiles.splice(j, 1)
        j--
      }
    }

    if(explosions[i].time > explosions[i].lifetime*2) {
      explosions[i].remove()
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
  cursorSprite.position.set(Mouse.x, Mouse.y, 3)

  cursorAimSprite.position.set(mouseVec.x, mouseVec.y, 3)

  renderer.render(scene, cam)

  requestAnimationFrame(update)
}

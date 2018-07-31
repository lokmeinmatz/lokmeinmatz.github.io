let debug = true


const width = 400 * 3
const height = 300 * 3
let totalTime = 0
const scene = new THREE.Scene()
const GRAVITY = new THREE.Vector2(0, -10)

function windowResized() {
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.width = width + "px";
  canvasstyle.height = height + "px";
}



const projectileTimeManager = {
  time: 2,
  _lastTime: 1,
  fullImg: null,
  init() {
    this.fullImg = document.querySelector('.pTimerFull')
  },

  update() {
    if(this.time == this._lastTime)return
    this._lastTime = this.time
    let inset = map(this.time, 1, 4, 180, 10)
    this.fullImg.style['clip-path'] = `inset(${inset}px 0px 0px 0px)` 
  }
}


let startTile = new Tile(TileIDs.STONE, 0, -2)
World.tiles.push(startTile)
let cam, renderer

const TexMap = new Map()
let projectileTracks = new THREE.LineSegments(new THREE.Geometry(), new THREE.LineBasicMaterial({color: 0xff00ff}))
scene.add(projectileTracks)

function init() {
  Keyboard.init()
  Player.init()
  projectileTimeManager.init()



  //TODO replace with background
  scene.background = new THREE.Color(0.5, 0.5, 0.5)

  cam = new THREE.OrthographicCamera(-5 * (width / height), 5 * (width / height), 5, -5, 0.1, 1000)
  cam.position.z += 10
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  document.body.appendChild(renderer.domElement)

  //console.log(tile)
  scene.add(startTile)


  windowResized()



  update()
}


function update() {
  World.update(1 / 60)
  Player.update()
  //UI
  projectileTimeManager.update()


  renderer.render(scene, cam)

  totalTime += 1 / 60
  requestAnimationFrame(update)
}



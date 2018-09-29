


const scene = new THREE.Scene()


/**
 * 
 * @description Maps val from range a-b to c-d
 * 
 * @param {number} val 
 * @param {number} a 
 * @param {number} b 
 * @param {number} c 
 * @param {number} d 
 */
 
 
function map(val, start1, stop1, start2, stop2) {
  return (val - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}


mountains = []

window.onresize = windowResized

function windowResized() {
  //let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  
  width = window.innerWidth
  height = window.innerHeight

  cam.aspect = width / height
  cam.updateProjectionMatrix()
  
  renderer.setSize(width, height)
  console.log(renderer.getSize())
}

let width = 400 * 2
let height = 300 * 2
let composer

var cam, renderer





window.onload = init
let shader

window.onkeypress = function(e) {
  if(e.key == 'f'){
    if( THREEx.FullScreen.activated() ){
      THREEx.FullScreen.cancel();
    }else{
      THREEx.FullScreen.request();
    }
    
  }
}

let material = new THREE.LineBasicMaterial({color: 0xffffff})

let line



function init() {

  //TODO replace with background
  scene.background = new THREE.Color(0, 0, 0)

  width = window.innerWidth
  height = window.innerHeight


  cam = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
  cam.position.z = 10;
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.autoClear = false


  composer = new THREE.EffectComposer(renderer)

  let renderPass = new THREE.RenderPass(scene, cam);
  composer.addPass(renderPass);

  let bloomPass = new THREE.BloomPass();
  composer.addPass(bloomPass);
  
  let effectCopy = new THREE.ShaderPass(THREE.CopyShader)
  effectCopy.renderToScreen = true  
  composer.addPass(effectCopy)

  document.body.appendChild(renderer.domElement)

  let geo = new THREE.Geometry()

  geo.vertices.push(new THREE.Vector3(0, 0, 0))
  geo.vertices.push(new THREE.Vector3(0, 1, 0))

  line = new THREE.Line(geo, material)
  scene.add( line )

  windowResized()

  update()
}


function update() {

  

  


  composer.render();

  requestAnimationFrame(update)
}



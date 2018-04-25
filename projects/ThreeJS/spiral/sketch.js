




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



function generateMountains(scale) {
  let THREEgeometry = new THREE.Geometry()
  THREEgeometry.faceVertexUvs = [[]]

  var attributes = {
    displacement: {
      type: 'f', // a float
      value: [] // an empty array
    }
  };
  let lastheight = 1.0

  for (let i = 0; i < 10; i++) {
    let nheight

    do {
      nheight = Math.random()
    } while (Math.abs(lastheight - nheight) < 0.3);
    lastheight = nheight
    THREEgeometry.vertices.push(new THREE.Vector3(i * scale, nheight * scale + scale, 0))
    THREEgeometry.vertices.push(new THREE.Vector3(i * scale, -scale, 0))

    if (i > 0) {
      let fi = i * 2 - 2

      //create first face (0, 1, 2)
      THREEgeometry.faces.push(new THREE.Face3(fi + 0, fi + 1, fi + 2))

      //create second face (1, 3, 2)
      THREEgeometry.faces.push(new THREE.Face3(fi + 1, fi + 3, fi + 2))

      //tri 1
      const uvScale = 1


      //get vectors
      let thisTop = THREEgeometry.vertices[fi + 2]
      let thisBot = THREEgeometry.vertices[fi + 3]
      let lastTop = THREEgeometry.vertices[fi + 0]
      let lastBot = THREEgeometry.vertices[fi + 1]

      let thisX = map(thisTop.x, 0, width, 0, 1) * uvScale
      let thisY = map(thisTop.y, 0, width, 0.0, 1.0) * uvScale
      let lastX = map(lastTop.x, 0, width, 0, 1) * uvScale
      let lastY = map(lastTop.y, 0, width, 0.0, 1.0) * uvScale

      if(true) {
        thisY = 1.0
        lastY = 1.0
      }

      //test
      thisY = 1
      lastY = 1

      THREEgeometry.faceVertexUvs[0].push([
        new THREE.Vector2(lastX, lastY),
        new THREE.Vector2(lastX, 0),
        new THREE.Vector2(thisX, thisY)
      ])

      //tri 2

      THREEgeometry.faceVertexUvs[0].push([
        new THREE.Vector2(lastX, 0),
        new THREE.Vector2(thisX, 0),
        new THREE.Vector2(thisX, thisY)
      ])
    }
  }




  
  let THREEobj = new THREE.Mesh(THREEgeometry, shader)
  THREEobj.position.z = -500
  THREEobj.position.x = -4.5 * scale
  THREEobj.position.y = - scale
  //this.THREEobj = new THREE.Mesh(THREEgeometry, new THREE.PointsMaterial())
  scene.add(THREEobj)
  
  

  console.log(THREEobj.material)
  //THREEobj.material.alphaTest = 0.1
  //THREEobj.material.map = new THREE.TextureLoader().load("imgs/dirt.jpg");
  //THREEobj.material.map.wrapS = this.THREEobj.material.map.wrapT = THREE.RepeatWrapping;
  return THREEobj
}

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

function init() {

  //TODO replace with background
  scene.background = new THREE.Color(0, 0, 0)

  width = window.innerWidth
  height = window.innerHeight


  cam = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
  cam.position.y = 100;
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

  //load shader
  let vert = document.getElementById('vertex').innerText
  let frag = document.getElementById('fragment').innerText
  //console.log(vert, frag)

  shader = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    blending: THREE.NormalBlending
  })

  windowResized()

  update()
}


function update() {

  if(mountains.length < 1 || mountains[mountains.length - 1].position.z > -400) {
    mountains.push(generateMountains(90))
  }
  for(let i = 0; i < mountains.length; i++) {
    mountains[i].position.z += 0.3
    if(mountains[i].position.z > -0.1) {
      mountains.splice(i, 1)
    }
  }

  


  composer.render();

  requestAnimationFrame(update)
}



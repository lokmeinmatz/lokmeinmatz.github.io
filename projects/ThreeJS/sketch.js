




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




function windowResized() {
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  let windowRatio = window.innerwidth / window.innerheight
  let canvasRatio = width / height
  if (windowRatio < canvasRatio) {
    canvasstyle.width = "100vw";
    canvasstyle.height = "auto";
  }
  else {
    canvasstyle.width = "auto";
    canvasstyle.height = "100vh";
  }
}

const width = 400 * 2
const height = 300 * 2


var cam, renderer



function generateMountains(scale) {
  let THREEgeometry = new THREE.Geometry()
  THREEgeometry.faceVertexUvs = [[]]

  for (let i = 0; i < 10; i++) {
    THREEgeometry.vertices.push(new THREE.Vector3(i * scale, Math.random() * scale + scale, 0))
    THREEgeometry.vertices.push(new THREE.Vector3(i * scale, 0, 0))

    if (i > 0) {
      let fi = i * 2 - 2

      //create first face (0, 1, 2)
      THREEgeometry.faces.push(new THREE.Face3(fi + 0, fi + 1, fi + 2))

      //create second face (1, 3, 2)
      THREEgeometry.faces.push(new THREE.Face3(fi + 1, fi + 3, fi + 2))

      //tri 1
      const uvScale = 2


      //get vectors
      let thisTop = THREEgeometry.vertices[fi + 2]
      let thisBot = THREEgeometry.vertices[fi + 3]
      let lastTop = THREEgeometry.vertices[fi + 0]
      let lastBot = THREEgeometry.vertices[fi + 1]

      let thisX = map(thisTop.x, 0, width, 0, 1) * uvScale
      let thisY = map(thisTop.y, 0, width, 0.0, 1.0) * uvScale
      let lastX = map(lastTop.x, 0, width, 0, 1) * uvScale
      let lastY = map(lastTop.y, 0, width, 0.0, 1.0) * uvScale



      //test
      //thisY = 0
      //lastY = 0

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

  
  let THREEobj = new THREE.Mesh(THREEgeometry, new THREE.MeshBasicMaterial({}))
  THREEobj.position.z = -100
  THREEobj.position.x = -4.5 * scale
  THREEobj.position.y = - scale
  //this.THREEobj = new THREE.Mesh(THREEgeometry, new THREE.PointsMaterial())
  scene.add(THREEobj)
  
  
  THREEobj.material.transparent = true
  THREEobj.material.map = gradTexture
  THREEobj.material.depthWrite = false
  THREEobj.material.flatShading = true
  THREEobj.material.premultipliedAlpha = true
  console.log(THREEobj.material)
  //THREEobj.material.alphaTest = 0.1
  //THREEobj.material.map = new THREE.TextureLoader().load("imgs/dirt.jpg");
  //THREEobj.material.map.wrapS = this.THREEobj.material.map.wrapT = THREE.RepeatWrapping;
  return THREEobj
}

window.onload = init


let gradTexture = new THREE.TextureLoader().load( "grad.png" )
function init() {

  //TODO replace with background
  scene.background = new THREE.Color(0, 0, 0)


  cam = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  document.body.appendChild(renderer.domElement)

  windowResized()

  update()
}


function update() {


  renderer.render(scene, cam)

  requestAnimationFrame(update)
}

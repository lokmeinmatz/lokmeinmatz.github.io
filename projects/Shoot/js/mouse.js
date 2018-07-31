const Mouse = {
    x:0,
    y:0,
    down:false
}

document.onwheel = function(e) {

  let delta = Math.sign(e.deltaY)
  projectileTimeManager.time -= delta
  projectileTimeManager.time = THREE.Math.clamp(projectileTimeManager.time, 1, 4)
}


document.onmousemove = function(e) {
  e = e || window.event; // IE-ism
  let realX = e.pageX
  let realY = e.pageY
  let canvas = document.getElementsByTagName("canvas")[0]
  if(!canvas) return
  let canvasrect = canvas.getBoundingClientRect()
  realX -= canvasrect.left
  realY -= canvasrect.top

  
  Mouse.x = map(realX, 0, canvasrect.width, 0, width)
  Mouse.y = map(realY, 0, canvasrect.height, height, 0)
  
  
  //console.log(Mouse.x, Mouse.y)

}
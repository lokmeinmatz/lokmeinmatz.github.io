let mic, fft;
let gl, canvas;

let clearQuad = {
  vertices: [
    -1,1,0.0,
    -1,-1,0.0,
    1,-1,0.0,
    1,1,0.0
  ],

  indices: [3,2,1,3,1,0],
  vertex_buffer: null,
  Index_Buffer: null,
  vertShader: null,
  fragShader: null,
  shaderProgram: null,

  init: function() {
    let vertCode =
    'attribute vec3 coordinates;' +
    'void main(void) {' +
    ' gl_Position = vec4(coordinates, 1.0);' +
    '}';
    let fragCode = 'void main(void) {' +' gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);' +'}';

    this.vertex_buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Create an empty buffer object to store Index buffer
    this.Index_Buffer = gl.createBuffer();

     // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Index_Buffer);

     // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

     // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(this.vertShader, vertCode);

     // Compile the vertex shader
    gl.compileShader(this.vertShader);

    // Create fragment shader object
     this.fragShader = gl.createShader(gl.FRAGMENT_SHADER);

     // Attach fragment shader source code
     gl.shaderSource(this.fragShader, fragCode);

     // Compile the fragmentt shader
     gl.compileShader(this.fragShader);

     // Create a shader program object to
     // store the combined shader program
     this.shaderProgram = gl.createProgram();

     // Attach a vertex shader
     gl.attachShader(this.shaderProgram, this.vertShader);

     // Attach a fragment shader
     gl.attachShader(this.shaderProgram, this.fragShader);
     // Link both the programs
    gl.linkProgram(this.shaderProgram);

  },

  draw: function(){
    // Use the combined shader program object
         gl.useProgram(this.shaderProgram);
         // Bind vertex buffer object
         gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);

         // Bind index buffer object
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.Index_Buffer);

         // Get the attribute location
         let coord = gl.getAttribLocation(this.shaderProgram, "coordinates");

         // Point an attribute to the currently bound VBO
         gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

         // Enable the attribute
         gl.enableVertexAttribArray(coord);
         // Clear the canvas
         //gl.clearColor(0.5, 0.5, 0.5, 0.9);


         // Set the view port
         gl.viewport(0,0,canvas.width,canvas.height);

         // Draw the triangle
         gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT,0);
  },
};

let vertCode = 'attribute vec3 coordinates;' +
'void main(void) {' +
' gl_Position = vec4(coordinates, 1.0);' +
'gl_PointSize = 2.0;'+
'}';

let fragCode = 'void main(void) {' +' gl_FragColor = vec4(1, 0.5, 0.0, 1);' +'}';

let vertShader, fragShader, shaderProgram;
let coord;
let vertex_buffer;


const res = 256;
function particle(x, y, vy, color, r){
  this.x = x;
  this.y = y;
  this.vy = vy;
  this.color = color;
  this.r = r;

  this.update = function(dt){
    this.r  = lerp(this.r, 0, 0.002);
    this.y += this.vy * dt;

  }

  this.draw = function(){
    stroke(this.color);
    point(this.x, this.y);
  }
}

function uploadParticleData(){
  //Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  // Pass the vertex data to the buffer
  //generate vertex data
  vertices = [];
  for(let i = 0; i < particles.length; i++){
    vertices.push(particles[i].x/ (width/2) - 1);
    vertices.push(particles[i].y/ (height/-2) + 1);
    vertices.push(0.0);
  }
  //console.log(vertices);
  //s;

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Link both programs
  gl.linkProgram(shaderProgram);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  /*======== Associating shaders to buffer objects ========*/

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

  // Get the attribute location
  var coord = gl.getAttribLocation(shaderProgram, "coordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coord);

  /*============= Drawing the primitive ===============*/



  // Set the view port
  gl.viewport(0,0,canvas.width,canvas.height);

  // Draw the triangle
  gl.drawArrays(gl.POINTS, 0, particles.length);

}

function setup() {
  canvas = document.getElementById("glcanvas");
  gl = initWebGL(canvas);
  vertex_buffer = gl.createBuffer();
  width = canvas.width;
  height = canvas.height;

  // Clear the canvas
  gl.clearColor(0.0, 0.0, 0.0, 1);
  clearQuad.init();
  // Enable the depth test
  //gl.enable(gl.DEPTH_TEST);

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);
  //compile shaders
  vertShader = gl.createShader(gl.VERTEX_SHADER);
  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);


  fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);

  // Compile the fragmentt shader
  gl.compileShader(fragShader);

  // Create a shader program object to store
  // the combined shader program
  shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);




  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  console.log("started webGL");
  mic = new p5.AudioIn();
  mic.start();
  console.log(mic);
  fft = new p5.FFT(0.0, res);
  fft.setInput(mic);

  let p = new particle(width/2, height/2, 1, color(1 + 80, 60, 80) , 10);
  particles.push(p);

}

function initWebGL() {
  gl = null;

  try {
    gl = canvas.getContext("webgl", { alpha: true, premultipliedalpha: false, preserveDrawingBuffer: true }) || canvas.getContext("experimental-webgl");
  }
  catch(e) {
  }

  // Wenn wir keinen WebGl Kontext haben

  if (!gl) {
    alert("WebGL konnte nicht initialisiert werden.");
    gl = null;
  }

  return gl;
}


let particles = [];
let threshold = 160;
function draw() {
  clearQuad.draw();
  uploadParticleData();

  let level = mic.getLevel() * 100;
  let spectrum = fft.analyze();
  noFill();
  colorMode(HSB);
  for(let i = 0; i < res; i++){
    if(spectrum[i] > threshold){
      let p = new particle(map(i, 0, res, 0, width), -5, 1, color(i + 80, 60, 80) , spectrum[i]/10);
      particles.push(p);
    }
  }

  for(let i = 0; i < particles.length; i++){
    if(particles[i]){
      particles[i].update(5);
      if(particles[i].y > height + 20){
        particles.splice(i, 1);
        i--;
      }
    }
  }


}

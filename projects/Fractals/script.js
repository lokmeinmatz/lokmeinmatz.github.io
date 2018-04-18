
function setup() {
  createCanvas(1000, 1000);
  let canvasstyle = document.getElementsByTagName("canvas")[0].style;
  canvasstyle.height = "100vh";
  canvasstyle.width = "auto";
  console.log("loaded");

  background(0);
  //draw base triangle
  push();
  translate(width/2, height/2 + 50);
  noStroke();

  let a = new p5.Vector(0, 0);
  a.add(new p5.Vector(0, -1000));

  let b = new p5.Vector(0, 0);
  b.add(new p5.Vector(1000, 0).rotate(120));

  let c = new p5.Vector(0, 0);
  c.add(new p5.Vector(-1000, 0).rotate(-120));

  serptri(a, b, c, 0);
  pop();
}
const size = 1000;
function draw() {

}


function serptri(a, b, c, counter){
  counter++;
  fill(255);
  beginShape();
  vertex(a.x, a.y);
  vertex(b.x, b.y);
  vertex(c.x, c.y);
  endShape(CLOSE);

  //get middlepoints
  let Mab = a.copy().add(b.copy().sub(a).mult(0.5));
  let Mac = a.copy().add(c.copy().sub(a).mult(0.5));
  let Mbc = b.copy().add(c.copy().sub(b).mult(0.5));

  fill(0);
  beginShape();
  vertex(Mab.x, Mab.y);
  vertex(Mac.x, Mac.y);
  vertex(Mbc.x, Mbc.y);
  endShape(CLOSE);

  let newCenter1 = average([a, Mab, Mac]);
  let newCenter2 = average([b, Mab, Mbc]);
  let newCenter3 = average([c, Mbc, Mac]);

  //Debug


  if(counter < 10){
    serptri(a, Mab, Mac, counter);
    serptri(b, Mab, Mbc, counter);
    serptri(c, Mbc, Mac, counter);
  }

}


function average(vectors){
  let all = new p5.Vector(0, 0);
  for(let i = 0; i < vectors.length; i++){
    all.add(vectors[i]);
  }
  all.div(vectors.length);
  return all;
}

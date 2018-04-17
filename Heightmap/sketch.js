var texture, overlay;
function setup() {
    // put setup code here
    createCanvas(1500, 1000);
    windowResized();
    //generate Image
    var noiseScale = 0.001;
    var heightMap = [];
    texture = createImage(width, height);
    texture.loadPixels();
    for (var x = 0; x < width; x++) {
        heightMap.push([]);
        for (var y = 0; y < height; y++) {
            var index = (x + y * width) * 4;
            var height_1 = noise(x * noiseScale, y * noiseScale);
            heightMap[x].push(height_1);
            //console.log(height)
            texture.pixels[index + 0] = height_1 * 255;
            texture.pixels[index + 1] = height_1 * 255;
            texture.pixels[index + 2] = height_1 * 255;
            texture.pixels[index + 3] = 255;
        }
    }
    texture.updatePixels();
    overlay = createImage(width, height);
    overlay.loadPixels();
}
function draw() {
    var deltatime = 1 / frameRate();
    deltatime = (deltatime > 0.1) ? 0 : deltatime;
    // put drawing code here
    //background(100, 150, 200)
    image(texture, 0, 0);
    //Draw rocket
    //Draw ground
    //Draw particles
    noStroke();
    fill(20, 20, 30, 50);
    // for(let p of particles) {
    //   p.draw()
    // }
}
function windowResized() {
    var canvasstyle = document.getElementsByTagName("canvas")[0].style;
    var windowRatio = window.innerWidth / window.innerHeight;
    var canvasRatio = width / height;
    if (windowRatio < canvasRatio) {
        canvasstyle.width = "100vw";
        canvasstyle.height = "auto";
    }
    else {
        canvasstyle.width = "auto";
        canvasstyle.height = "100vh";
    }
}
//# sourceMappingURL=sketch.js.map
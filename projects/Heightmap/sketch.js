var tex;
var color1;
var color2;
var STEPS = 3;
var noiseScale = 0.0001;
var spinnerDom;
function genColor() {
    return p5.Vector.random3D().add(createVector(1, 1, 1)).mult(255 / 2);
}
var getCol = function (val) {
    val *= STEPS;
    val = round(val);
    val /= STEPS;
    return p5.Vector.lerp(color1, color2, val);
};
function keyReleased() {
    if (key == 'S')
        saveCanvas("wallpaper_" + new Date().getTime() + ".png", 'png');
    if (key == 'R') {
        spinnerDom.classList.remove('invisible');
        setTimeout(generate, 50);
    }
}
function generate() {
    //generate Image
    //color1 = createVector( 84,  19, 136)
    //color2 = createVector(217,   3, 104)
    color1 = genColor();
    color2 = genColor();
    console.log(color1);
    var noiseMap = [];
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    do {
        lowest = Number.POSITIVE_INFINITY;
        highest = Number.NEGATIVE_INFINITY;
        var offsetX = random(0, 10 / noiseScale);
        var offsetY = random(0, 10 / noiseScale);
        console.log("Generating noise at " + offsetX + " " + offsetY);
        for (var x = 0; x < width; x++) {
            noiseMap[x] = [];
            for (var y = 0; y < height; y++) {
                var h = noise((x + offsetX) * noiseScale, (y + offsetY) * noiseScale) * 50 - 25;
                h = constrain(h, 0, 1);
                noiseMap[x][y] = h;
                highest = (highest < h) ? h : highest;
                lowest = (lowest > h) ? h : lowest;
            }
        }
        console.log("Highest: " + highest + " | Lowest: " + lowest);
    } while (highest - lowest < 0.01);
    tex = createImage(width, height);
    tex.loadPixels();
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var index = (x + y * width) * 4;
            var h = noiseMap[x][y];
            var color_1 = getCol(map(h, lowest, highest, 0, 1));
            //console.log(height)
            tex.pixels[index + 0] = color_1.x;
            tex.pixels[index + 1] = color_1.y;
            tex.pixels[index + 2] = color_1.z;
            tex.pixels[index + 3] = 255;
        }
    }
    tex.updatePixels();
    spinnerDom.classList.add('invisible');
}
function setup() {
    spinnerDom = document.getElementById('wait');
    console.log(spinnerDom);
    // put setup code here
    createCanvas(2560, 1440);
    windowResized();
    tex = createImage(width, height);
}
function draw() {
    var deltatime = 1 / frameRate();
    deltatime = (deltatime > 0.1) ? 0 : deltatime;
    // put drawing code here
    //background(100, 150, 200)
    image(tex, 0, 0);
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
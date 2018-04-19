var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function setup() {
    // put setup code here
    createCanvas(600, 1000);
    windowResized();
    setupPhysics();
}
var rocket, ground;
var particles;
var rocketOrigin;
var Rocket = /** @class */ (function (_super) {
    __extends(Rocket, _super);
    function Rocket(origin) {
        var _this = this;
        var rmesh = [createVector(10, 40), createVector(-10, 40), createVector(-10, -40), createVector(10, -40), createVector(0, 40)]; //last is engine
        _this = _super.call(this, origin, new Mesh(rmesh, [[0, 1], [1, 2], [2, 3], [3, 0]]), 100, 0, false) || this;
        _this.rotation = PI;
        _this.engine = { pos: _this.mesh.verts[4], strength: 100, angle: 0 };
        return _this;
    }
    Rocket.prototype.reset = function (pos) {
        this.engine = { pos: this.mesh.verts[4], strength: 100, angle: 0 };
        this.position = pos;
        this.velocity = createVector(0, 0);
        this.rotation = 0;
        this.angvelocity = 0;
        this.angacceleration = 0;
    };
    Rocket.prototype.debugDraw = function () {
        _super.prototype.debugDraw.call(this);
        fill(255, 255, 0);
        noStroke();
        ellipse(this.engine.pos.x, this.engine.pos.y, 4);
        //Draw engine force line
        var eVec = p5.Vector.fromAngle(this.rotation + PI / 2 + this.engine.angle).mult(20);
        stroke(255);
        line(this.engine.pos.x, this.engine.pos.y, this.engine.pos.x + eVec.x, this.engine.pos.y + eVec.y);
    };
    Rocket.prototype.update = function (delta) {
        if (keyIsPressed) {
            if (key == 'w')
                this.engine.strength = 2000;
            if (key == 'a')
                this.engine.angle = 0.3;
            if (key == 'd')
                this.engine.angle = -0.3;
        }
        else {
            this.engine.strength = 0;
            this.engine.angle = 0;
        }
        this.engine.pos = this.mesh.verts[4];
        this.applyForce(p5.Vector.fromAngle(this.rotation + PI / 2 + this.engine.angle).mult(-this.engine.strength), this.engine.pos);
        if (ground.intersectsBroad(this)) {
            //console.log("Intersecting")
            var result = ground.intersectsDetailed(this);
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var res = result_1[_i];
                fill(200, 255, 100);
                ellipse(res.point.x, res.point.y, 4);
                line(res.point.x, res.point.y, res.point.x + res.normal.x * res.pendepth, res.point.y + res.normal.y * res.pendepth);
                this.position.add(res.normal.copy().mult(res.pendepth));
                this.applyForce(res.normal.copy().mult(res.pendepth), res.point);
                //Draw nearest site
                var p0 = ground.mesh.verts[res.p0];
                var p1 = ground.mesh.verts[res.p1];
                line(p0.x, p0.y, p1.x, p1.y);
                //do response
                var r = void 0;
                var vap1 = this.velocity.copy().add(createVector(-this.angvelocity));
            }
        }
        _super.prototype.update.call(this, delta);
    };
    return Rocket;
}(PhysicsObject));
var Particle = /** @class */ (function () {
    function Particle(x, y, vx, vy) {
        this.pos = createVector(x, y);
        this.vel = createVector(vx, vy);
    }
    Particle.prototype.draw = function () {
        ellipse(this.pos.x, this.pos.y, 4);
        this.pos.add(this.vel);
        this.vel.mult(0.99);
    };
    return Particle;
}());
function setupPhysics() {
    var gmesh = new Mesh([createVector(0, 0), createVector(width - 5, 0), createVector(width - 5, 30), createVector(0, 30)], [[0, 1], [1, 2], [2, 3], [3, 0]]);
    ground = new PhysicsObject(createVector(0, 500), gmesh, 1, 0, true);
    ground.update(0);
    rocketOrigin = createVector(width / 2, 200);
    rocket = new Rocket(rocketOrigin.copy());
}
function draw() {
    var deltatime = 1 / frameRate();
    deltatime = (deltatime > 0.1) ? 0 : deltatime;
    // put drawing code here
    background(100, 150, 200);
    //Draw rocket
    //Draw ground
    ground.debugDraw();
    //draw rocket
    rocket.debugDraw();
    rocket.update(deltatime);
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
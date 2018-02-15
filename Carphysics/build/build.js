var Physics;
(function (Physics) {
    var Ray = (function () {
        function Ray(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        }
        Ray.prototype.draw = function () {
            stroke(250);
            line(this.origin.x, this.origin.y, this.origin.x + this.direction.x * 100, this.origin.y + this.direction.y * 100);
        };
        return Ray;
    }());
    Physics.Ray = Ray;
    var Line = (function () {
        function Line(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
        Line.prototype.draw = function () {
            stroke(250);
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        };
        return Line;
    }());
    Physics.Line = Line;
    function getClosestIntersection(ray, mesh) {
        var closestIntersection = { intersect: createVector(0, 0), t: 1000000 };
        function rayIntersection(l1, l2) {
            function cross2d(v1, v2) {
                return v1.x * v2.y - v1.y * v2.x;
            }
            var rxs = cross2d(l1.direction, l2.direction);
            var t1 = cross2d(p5.Vector.sub(l2.origin, l1.origin), l2.direction) / rxs;
            var t2 = cross2d(p5.Vector.sub(l2.origin, l1.origin), l1.direction) / rxs;
            if (t1 <= 0 || t2 < 0 || t2 > 1) {
                return null;
            }
            return { intersect: createVector(l1.origin.x + l1.direction.x * t1, l1.origin.y + l1.direction.y * t1), t: t1 };
        }
        for (var _i = 0, _a = mesh.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            var p1 = mesh.points[edge[0]];
            var p2 = mesh.points[edge[1]];
            var intersect = rayIntersection(ray, new Line(p1, p5.Vector.sub(p2, p1)));
            if (intersect == null) {
                continue;
            }
            if (intersect.t < closestIntersection.t) {
                closestIntersection = intersect;
            }
        }
        return closestIntersection;
    }
    Physics.getClosestIntersection = getClosestIntersection;
})(Physics || (Physics = {}));
var ground = 850;
var Rocket = (function () {
    function Rocket() {
    }
    return Rocket;
}());
function setup() {
    createCanvas(1800, 1000);
    var canvasstyle = document.getElementsByTagName("canvas")[0].style;
    canvasstyle.height = "100vh";
    canvasstyle.width = "auto";
    angleMode(DEGREES);
}
var lastFrameMouse = false;
function draw() {
    if (mouseIsPressed) {
        if (!lastFrameMouse) {
        }
    }
    else {
    }
    lastFrameMouse = mouseIsPressed;
    background(100, 150, 255);
    stroke(255);
    line(0, ground, width, ground);
    fill(255);
    noStroke();
    textSize(20);
    text(frameRate().toFixed(2).toString(), 15, 40);
    if (frameRate() > 1 && frameRate() < 200) {
        dt = 1 / frameRate();
    }
}
//# sourceMappingURL=build.js.map
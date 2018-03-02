var gravity = { x: 0, y: 0, z: 0 };
function linePointDistance(p1, p2, point) {
    var dividend = Math.abs((p2.y - p1.y) * point.x - (p2.x - p1.x) * point.y + p2.x * p1.y - p2.y * p1.x);
    var divisor = Math.sqrt((p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x));
    return dividend / divisor;
}
var PhysicsObject = /** @class */ (function () {
    function PhysicsObject(origin, mesh, mass, rotation, isStatic) {
        this.mesh = mesh;
        this.isStatic = isStatic || false;
        this.position = origin;
        this.velocity = createVector(0, 0);
        this.acceleration = createVector(0, 0);
        this.mass = mass || 1;
        this.rotation = rotation || 0;
        this.angvelocity = 0;
        this.angacceleration = 0;
        this.AABB = { tl: createVector(0, 0), br: createVector(0, 0) };
        this.updateAABB();
    }
    PhysicsObject.prototype.updateAABB = function () {
        //ntl : smallest br : biggest
        var ntl = createVector(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY), nbr = createVector(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        this.mesh.verts.forEach(function (v) {
            if (v.x < ntl.x)
                ntl.x = v.x;
            if (v.x > nbr.x)
                nbr.x = v.x;
            if (v.y < ntl.y)
                ntl.y = v.y;
            if (v.y > nbr.y)
                nbr.y = v.y;
        });
        this.AABB.tl = ntl;
        this.AABB.br = nbr;
    };
    PhysicsObject.prototype.intersectsBroad = function (other) {
        //x check
        if (other.AABB.br.x < this.AABB.tl.x || other.AABB.tl.x > this.AABB.br.x || other.AABB.br.y < this.AABB.tl.y || other.AABB.tl.y > this.AABB.br.y) {
            //y check
            //console.log("x overlapping")
            return false;
        }
        return true;
    };
    PhysicsObject.prototype.intersectsDetailed = function (other) {
        //test against other mesh
        var allIntersections = [];
        for (var _i = 0, _a = other.mesh.verts; _i < _a.length; _i++) {
            var otherVert = _a[_i];
            //smallest pendepth
            var nearestSide = { pendepth: Number.POSITIVE_INFINITY, normal: null, point: null, p0: 0, p1: 0 };
            for (var _b = 0, _c = this.mesh.edges; _b < _c.length; _b++) {
                var edge = _c[_b];
                var p0 = this.mesh.verts[edge[0]];
                var p1 = this.mesh.verts[edge[1]];
                var d = p1.copy().sub(p0);
                var up = createVector(0, 0, 1);
                var n = p5.Vector.cross(d, up).normalize();
                //debug draw normal
                var pmiddle = p0.copy().add(p1).mult(0.5);
                stroke(255);
                line(pmiddle.x, pmiddle.y, pmiddle.x + n.x * 30, pmiddle.y + n.y * 30);
                //if one vertex * n is <0 for all edges => inside, get nearest pmiddle and n
                if (p5.Vector.dot(n, otherVert.copy().sub(pmiddle)) < 0) {
                    var pendepth = linePointDistance(p0, p1, otherVert);
                    if (nearestSide.pendepth > pendepth) {
                        nearestSide.pendepth = pendepth;
                        nearestSide.normal = n;
                        nearestSide.point = otherVert;
                        nearestSide.p0 = edge[0];
                        nearestSide.p1 = edge[1];
                    }
                }
                else {
                    nearestSide = { pendepth: Number.POSITIVE_INFINITY, normal: null, point: null, p0: 0, p1: 0 };
                    break;
                }
            }
            if (nearestSide.normal) {
                //has found a ipoint
                allIntersections.push(nearestSide);
            }
        }
        return allIntersections;
    };
    PhysicsObject.prototype.update = function (delta) {
        var _this = this;
        if (!this.isStatic) {
            this.position.add(this.velocity.copy().mult(delta));
            this.velocity.add(this.acceleration.copy().mult(delta));
            this.velocity.mult(0.995);
            this.acceleration = createVector(gravity.x, gravity.y);
            this.rotation += this.angvelocity * delta;
            this.angvelocity += this.angacceleration * delta;
            this.angvelocity *= 0.995;
            this.angacceleration = 0;
        }
        //Calculate new Vertices
        this.mesh.verts = this.mesh.staticVerts.map(function (v) { return v.copy().rotate(_this.rotation).add(_this.position); });
        //update AABB
        this.updateAABB();
    };
    /**
     * @param position Global position to apply force
     */
    PhysicsObject.prototype.applyForce = function (force, position) {
        this.acceleration.add(force.copy().mult(1 / this.mass));
        if (position) {
            var r = position.copy().sub(this.position);
            var tau = r.x * force.y - r.y * force.x;
            this.applyRotation(tau);
        }
    };
    PhysicsObject.prototype.applyRotation = function (Torque) {
        this.angacceleration = Torque / (this.mass * 1000);
    };
    PhysicsObject.prototype.debugDraw = function () {
        stroke(255, 0, 0);
        noFill();
        for (var _i = 0, _a = this.mesh.edges; _i < _a.length; _i++) {
            var edge = _a[_i];
            var p0 = this.mesh.verts[edge[0]];
            var p1 = this.mesh.verts[edge[1]];
            line(p0.x, p0.y, p1.x, p1.y);
        }
        //Draw AABB
        stroke(0, 255, 0);
        rect(this.AABB.tl.x, this.AABB.tl.y, this.AABB.br.x - this.AABB.tl.x, this.AABB.br.y - this.AABB.tl.y);
    };
    return PhysicsObject;
}());
var Mesh = /** @class */ (function () {
    function Mesh(verts, edges) {
        this.staticVerts = verts;
        this.verts = verts.map(function (v) { return v.copy(); });
        this.edges = edges;
    }
    return Mesh;
}());
var Ray = /** @class */ (function () {
    function Ray(origin, direction) {
        this.origin = origin;
        this.direction = direction;
    }
    return Ray;
}());
//return vector with intersection point
function rayIntersection(ray, edge) {
    function cross2d(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x;
    }
    var rxs = cross2d(ray.direction, edge.direction);
    var t1 = cross2d(p5.Vector.sub(edge.origin, ray.origin), edge.direction) / rxs;
    var t2 = cross2d(p5.Vector.sub(edge.origin, ray.origin), edge.direction) / rxs;
    if (t1 <= 0 || t2 < 0 || t2 > 1) {
        return null;
    }
    //TODO check if t1 and t2 in range
    return { intersect: createVector(ray.origin.x + ray.direction.x * t1, ray.origin.y + ray.direction.y * t1), t: t1 };
}
function getClosestIntersection(ray, mesh) {
    var closestIntersection = { intersect: createVector(0, 0), t: 1000000 };
    for (var _i = 0, _a = mesh.edges; _i < _a.length; _i++) {
        var edge = _a[_i];
        var p1 = mesh.verts[edge[0]];
        var p2 = mesh.verts[edge[1]];
        var intersect = rayIntersection(ray, { origin: p1, direction: p5.Vector.sub(p2, p1) });
        if (intersect == null) {
            continue;
        }
        if (intersect.t < closestIntersection.t) {
            closestIntersection = intersect;
        }
    }
    return closestIntersection;
}
//# sourceMappingURL=physics.js.map
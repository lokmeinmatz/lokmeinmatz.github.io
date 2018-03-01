const gravity = {x: 0, y: 0, z: 0}

function linePointDistance(p1 : p5.Vector, p2: p5.Vector, point: p5.Vector) : number {
  let dividend = Math.abs((p2.y - p1.y)*point.x - (p2.x - p1.x) * point.y + p2.x * p1.y  - p2.y * p1.x)

  let divisor = Math.sqrt((p2.y - p1.y) * (p2.y - p1.y) + (p2.x - p1.x) * (p2.x - p1.x))

  return dividend / divisor
}

class PhysicsObject {
  mesh : Mesh
  isStatic
  position : p5.Vector
  velocity
  acceleration
  mass
  rotation
  angvelocity
  angacceleration

  AABB : {tl : p5.Vector, br : p5.Vector}

  constructor(origin, mesh, mass, rotation, isStatic) {
    this.mesh = mesh
    this.isStatic = isStatic || false
    this.position = origin
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.mass = mass || 1

    this.rotation = rotation ||0
    this.angvelocity = 0
    this.angacceleration = 0
    this.AABB = {tl : createVector(0, 0), br: createVector(0, 0)}
    this.updateAABB()
  }

  updateAABB() {
    //ntl : smallest br : biggest
    let ntl = createVector(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY), nbr = createVector(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY)

    this.mesh.verts.forEach(v => {
      if(v.x < ntl.x)ntl.x = v.x
      if(v.x > nbr.x)nbr.x = v.x
      if(v.y < ntl.y)ntl.y = v.y
      if(v.y > nbr.y)nbr.y = v.y
    });

    this.AABB.tl = ntl
    this.AABB.br = nbr
  }

  intersectsBroad(other : PhysicsObject) : boolean {
    //x check
    if(other.AABB.br.x < this.AABB.tl.x || other.AABB.tl.x > this.AABB.br.x || other.AABB.br.y < this.AABB.tl.y || other.AABB.tl.y > this.AABB.br.y) {
      //y check
      //console.log("x overlapping")
      return false
    }

    return true
  }

  intersectsDetailed(other : PhysicsObject) : {point : p5.Vector, pendepth: number, normal: p5.Vector, p0: number, p1: number} | void {

    //test against other mesh
    for(let otherVert of other.mesh.verts) {
      //smallest pendepth
      let nearestSide = {pendepth: Number.POSITIVE_INFINITY, normal: null, point: null, p0 : 0, p1: 0}
      for(let edge of this.mesh.edges) {
        let p0 = this.mesh.verts[edge[0]]
        let p1 = this.mesh.verts[edge[1]]
        let d = p1.copy().sub(p0)
        let up = createVector(0, 0, 1)
        let n = p5.Vector.cross(d, up).normalize()
  
        //debug draw normal
        let pmiddle = p0.copy().add(p1).mult(0.5)

        stroke(255)
        line(pmiddle.x, pmiddle.y, pmiddle.x + n.x * 30, pmiddle.y + n.y * 30)
        
        //if one vertex * n is <0 for all edges => inside, get nearest pmiddle and n
        if(p5.Vector.dot(n, otherVert.copy().sub(pmiddle)) < 0) {
          let pendepth = linePointDistance(p0, p1, otherVert)
          if(nearestSide.pendepth > pendepth) {
            nearestSide.pendepth = pendepth
            nearestSide.normal = n
            nearestSide.point = otherVert
            nearestSide.p0 = edge[0]
            nearestSide.p1 = edge[1]
          }
        }
        else{
          nearestSide = {pendepth: Number.POSITIVE_INFINITY, normal: null, point: null, p0 : 0, p1: 0}
          break;
        }
      }

      if(nearestSide.normal) {
        //has found a ipoint
        return nearestSide
      }

      
    }

    
  }

  update(delta) {

    
    if(!this.isStatic){
      this.position.add(this.velocity.copy().mult(delta))
      this.velocity.add(this.acceleration.copy().mult(delta))
      this.velocity.mult(0.995)
      this.acceleration = createVector(gravity.x, gravity.y)

      this.rotation += this.angvelocity * delta

      this.angvelocity += this.angacceleration * delta
      this.angvelocity *= 0.995
      this.angacceleration = 0
    }
    //Calculate new Vertices
    this.mesh.verts = this.mesh.staticVerts.map(v => {return v.copy().rotate(this.rotation).add(this.position)})

    //update AABB
    this.updateAABB()
  }

  /**
   * @param position Global position to apply force
   */

  applyForce(force : p5.Vector, position?: p5.Vector) {
    this.acceleration.add(force.copy().mult(1/this.mass))

    if(position) {
      let r = position.copy().sub(this.position)
      let tau = r.x * force.y - r.y * force.x
      this.applyRotation(tau)
    }
  }

  

  applyRotation(Torque : number) {
    this.angacceleration = Torque / (this.mass * 1000)
  }

  debugDraw() {
    stroke(255, 0, 0)
    noFill()

    
    for(let edge of this.mesh.edges) {
      let p0 = this.mesh.verts[edge[0]]
      let p1 = this.mesh.verts[edge[1]]
      line(p0.x, p0.y, p1.x, p1.y)
    }
    
    //Draw AABB
    stroke(0, 255, 0)
    rect(this.AABB.tl.x, this.AABB.tl.y, this.AABB.br.x - this.AABB.tl.x, this.AABB.br.y - this.AABB.tl.y)
  }
}

class Mesh {
  staticVerts : p5.Vector[]
  verts : p5.Vector[]
  edges : number[][]
  constructor(verts : p5.Vector[], edges) {
    this.staticVerts = verts
    this.verts = verts.map(v => v.copy())
    this.edges = edges
  }
}

class Ray {
  origin
  direction
  constructor(origin, direction) {
    this.origin = origin
    this.direction = direction
  }
}


//return vector with intersection point
function rayIntersection(ray : Ray, edge : {origin : p5.Vector, direction: p5.Vector}) : Intersection {
    
  function cross2d(v1, v2) {
    return v1.x*v2.y - v1.y*v2.x;
  }

  let rxs = cross2d(ray.direction, edge.direction);

  let t1 = cross2d(p5.Vector.sub(edge.origin, ray.origin), edge.direction) / rxs;

  let t2 = cross2d(p5.Vector.sub(edge.origin, ray.origin), edge.direction) / rxs;

  if (t1 <= 0 || t2 < 0 || t2 > 1) {
    return null;
  }
  //TODO check if t1 and t2 in range
  return {intersect:createVector(ray.origin.x + ray.direction.x * t1, ray.origin.y + ray.direction.y * t1), t:t1};

}

interface Intersection {
  intersect : p5.Vector
  t : number
}

function getClosestIntersection(ray : Ray, mesh : Mesh) : Intersection {
  let closestIntersection = {intersect:createVector(0, 0), t:1000000};


  for(let edge of mesh.edges) {
      let p1 = mesh.verts[edge[0]];
      let p2 = mesh.verts[edge[1]];

      let intersect = rayIntersection(ray, {origin: p1, direction: p5.Vector.sub(p2, p1)});
      if(intersect == null) {continue}
      if(intersect.t < closestIntersection.t) {
          closestIntersection = intersect;
      }

}

return closestIntersection;
}
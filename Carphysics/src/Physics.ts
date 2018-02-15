module Physics {

    export class Ray {
        origin : p5.Vector
        direction : p5.Vector
        constructor(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        } 
    
        draw() {
            stroke(250);
            line(this.origin.x, this.origin.y, this.origin.x + this.direction.x * 100, this.origin.y + this.direction.y * 100);
        }
    }

    export class Line {
        p1 : p5.Vector;
        p2 : p5.Vector;
        constructor(p1 : p5.Vector, p2 : p5.Vector) {
            this.p1 = p1;
            this.p2 = p2;
        } 
    
        draw() {
            stroke(250);
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        }
    }

    export class Segment extends Line {
        constructor(p1 : p5.Vector, p2 : p5.Vector) {
            super(p1, p2);
        } 
    }

    export class Mesh {
        points : p5.Vector[];
        edges : number[][];
        color : p5.Color;
        constructor(points, edges, color) {
            this.points = points;
            this.edges = edges;
            this.color = color;
        }
    
        draw() {
            
            noFill();
            stroke(this.color);
            strokeWeight(1);
    
            for(let edge of this.edges){
                let p1 = this.points[edge[0]];
                let p2 = this.points[edge[1]];
    
                //Draw
                line(p1.x, p1.y, p2.x, p2.y);
            }    
        }
    
        copy() {
            let res = new Mesh([], [], [])
            for(let pt of this.points) {
                res.points.push(pt.copy())
            }
    
            for(let edge of this.edges) {
                res.edges.push(edge.slice())
            }
            res.color = color(this.color.r, this.color.g, this.color.b)
            return res
        }
    
        debugDraw() {
            //call after draw
            fill(255, 50, 0)
            for(let i = 0; i < this.points.length; i++) {
                let pt = this.points[i]
                ellipse(pt.x, pt.y, 5)
                text(i.toString(), pt.x + 10, pt.y + 10)
            }
        }
    }
    
    
    export function getClosestIntersection(ray : Ray, mesh : Mesh) {
        let closestIntersection = {intersect:createVector(0, 0), t:1000000};
        
        //return vector with intersection point
        function rayIntersection(l1, l2) {
            
            function cross2d(v1, v2) {
            return v1.x*v2.y - v1.y*v2.x;
            }
        
            let rxs = cross2d(l1.direction, l2.direction);
        
            let t1 = cross2d(p5.Vector.sub(l2.origin, l1.origin), l2.direction) / rxs;
        
            let t2 = cross2d(p5.Vector.sub(l2.origin, l1.origin), l1.direction) / rxs;
        
            if (t1 <= 0 || t2 < 0 || t2 > 1) {
            return null;
            }
            //TODO check if t1 and t2 in range
            return {intersect:createVector(l1.origin.x + l1.direction.x * t1, l1.origin.y + l1.direction.y * t1), t:t1};
        
        }
        
        for(let edge of mesh.edges) {
            let p1 = mesh.points[edge[0]];
            let p2 = mesh.points[edge[1]];

            let intersect = rayIntersection(ray, new Line(p1, p5.Vector.sub(p2, p1)));
            if(intersect == null) {continue}
            if(intersect.t < closestIntersection.t) {
                closestIntersection = intersect;
            }
        
        }

        return closestIntersection;
    } 
    
    
    interface PhysicsObject {
    
    }
}





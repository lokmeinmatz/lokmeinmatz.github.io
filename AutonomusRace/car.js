const rayCount = 10

class Car {
    constructor(pos) {
        //INPUT: rays + speed
       this.brain = new Network([rayCount + 1, 20, 15, 4])
       this.pos = pos
       this.direction = 180
       this.baseMesh = new Mesh([createVector(10, 30), createVector(-10, 30), createVector(-10, -10), createVector(10, -10)], [[0, 1], [1, 2], [2, 3], [3, 0]], color(random(100, 255), random(100, 255), random(100, 255)));
       this.transformedMesh = this.baseMesh.copy()
       this.updateTransMesh()
       this.prevTransformedMesh = this.transformedMesh.copy()
       
       this.acc = 0
       this.speed = 0
       this.break = 0
       this.steer = 0
       this.distTravelled = 0
       this.collided = false
    
        this.dist = new Array(rayCount).fill(0, 0, rayCount)
    }

    copy() {
        let res = new Car(this.pos.copy())
        res.direction = this.direction
        res.brain = this.brain.copy()
        res.distTravelled = this.distTravelled
        return res
    }

    reset(pos) {
        this.direction = 180
        this.pos = pos.copy()
        this.speed = 0
        this.acc = 0
        this.break = 0
        this.distTravelled = 0
        this.collided = false
        this.updateTransMesh()
        this.prevTransformedMesh = this.transformedMesh.copy()
    }

    updateBrain() {
        
        let res = this.brain.process(this.dist)
        //console.log(res)
        //res[0] -> acceleration
        this.acc = res[0]

        //res[1] -> breaking
        this.break = res[1]

        //res[2] -> left
        this.steer = res[2]
        this.steer -= res[3]
    }

    checkForCollision() {
        //Build line between old point in mesh and new point, check line against segments of track
        
        for(let i = 0; i < this.transformedMesh.points.length; i++) {
            let oldP = this.prevTransformedMesh.points[i]
            let newP = this.transformedMesh.points[i]
            let line = new Line(oldP, newP.copy().sub(oldP))
            let its = getClosestIntersection(line)
            if(its.t <= 1) {
                //collision
               
                this.collided = true
            }
        }
        

        this.prevTransformedMesh = this.transformedMesh.copy()
    }

    updatePhysics() {
        this.updateTransMesh()
        
        if(!this.collided) {
            this.checkForCollision()
            let dirV = p5.Vector.fromAngle(radians(this.direction + 90) )
            this.speed += this.acc * 0.1 * (1 - Math.abs(this.steer * 0.5))
            
            this.speed -= constrain(this.break * 0.1, 0, this.speed)
            this.distTravelled += this.speed
    
            //clamp all vars
            this.speed = constrain(this.speed, -5, 5)
            this.steer = constrain(this.steer, -1.5, 1.5)
           
    
            this.pos.add(dirV.copy().mult(this.speed))
            
            this.direction += this.steer * this.speed
            let trailI = (floor(this.pos.x) + floor(this.pos.y) * width) * 4
            trailMap.pixels[trailI] = 255
            trailMap.pixels[trailI + 3] = 255

            //calculate new dist
            fill(255, 0, 0)
            let rayPos = this.pos.copy().add(dirV.copy().mult(30))
            for(let i = 0; i < this.dist.length; i++) {
                let angle = map(i, 0, this.dist.length - 1, -85, 85)
                let dirV = p5.Vector.fromAngle(radians(this.direction + 90 + angle))
                let ray = new Line(rayPos, dirV)
                //ray.draw()
                let res = getClosestIntersection(ray)
                let d = 1
                
                if(res.t != 1000000) {
                    //ellipse(res.intersect.x, res.intersect.y, 5)
                    d = res.intersect.dist(rayPos)
                }
                this.dist[i] = constrain(d, 0, 200) / 200
                
            }

            this.dist[rayCount] = this.speed
            
            this.updateBrain()
        }
        

    }

    updateTransMesh() {
        this.transformedMesh = this.baseMesh.copy()
        for(let pt of this.transformedMesh.points) {
            pt.rotate(this.direction)
            pt.add(this.pos)
        }
    }

    draw() {
        
        //draw center
        
        stroke(this.baseMesh.color)
        
        
        this.transformedMesh.draw()
    }
}
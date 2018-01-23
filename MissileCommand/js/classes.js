
class Ground {

    constructor() {
        this.cmesh = new Mesh([], [])

        //generate
        //verts : 50 -> 5, 25, 45 are bases (higher)
        const offsetScale = 30
        for (let i = 0; i < 50; i++) {
            let offset = 0
            if (i <= 5) {
                offset = Math.tanh(i - 3) * -offsetScale
            }
            else if (i <= 15) {
                offset = Math.tanh(-i + 7) * -offsetScale
            }
            else if (i <= 25) {
                offset = Math.tanh(i - 23) * -offsetScale
            }
            else if (i <= 35) {
                offset = Math.tanh(-i + 27) * -offsetScale
            }
            else if (i <= 45) {
                offset = Math.tanh(i - 43) * -offsetScale
            }
            else {
                offset = Math.tanh(-i + 47) * -offsetScale
            }
            this.cmesh.points[i] = createVector(map(i, 0, 49, 0, width), 100 + noise(i * 0.5) * 10 - offset)
            if (i < 49) {
                this.cmesh.edges[i] = [i, i + 1]
            }
        }


        //points: only top row -> triangulation simpler
        //construct own THREEjs Mesh
        let THREEgeometry = new THREE.Geometry()
        THREEgeometry.faceVertexUvs = [[]]
        for (let i = 0; i < this.cmesh.points.length; i++) {
            //create top and bottom point
            let cmp = this.cmesh.points[i]
            THREEgeometry.vertices.push(new THREE.Vector3(cmp.x, cmp.y, 0))
            THREEgeometry.vertices.push(new THREE.Vector3(cmp.x, 0, 0))


            if (i > 0) {
                //add faces


                let fi = i * 2 - 2

                //create first face (0, 1, 2)
                THREEgeometry.faces.push(new THREE.Face3(fi + 0, fi + 1, fi + 2))

                //create second face (1, 3, 2)
                THREEgeometry.faces.push(new THREE.Face3(fi + 1, fi + 3, fi + 2))

                //create UVs
                // add uvs

                //tri 1
                const scale = 2


                //get vectors
                let thisTop = THREEgeometry.vertices[fi + 2]
                let thisBot = THREEgeometry.vertices[fi + 3]
                let lastTop = THREEgeometry.vertices[fi + 0]
                let lastBot = THREEgeometry.vertices[fi + 1]

                let thisX = map(thisTop.x, 0, width, 0, 1) * scale
                let thisY = map(thisTop.y, 0, width, 0.0, 1.0) * scale
                let lastX = map(lastTop.x, 0, width, 0, 1) * scale
                let lastY = map(lastTop.y, 0, width, 0.0, 1.0) * scale



                //test
                //thisY = 0
                //lastY = 0

                THREEgeometry.faceVertexUvs[0].push([
                    new THREE.Vector2(lastX, lastY),
                    new THREE.Vector2(lastX, 0),
                    new THREE.Vector2(thisX, thisY)
                ])

                //tri 2

                THREEgeometry.faceVertexUvs[0].push([
                    new THREE.Vector2(lastX, 0),
                    new THREE.Vector2(thisX, 0),
                    new THREE.Vector2(thisX, thisY)
                ])
            }
        }



        this.THREEobj = new THREE.Mesh(THREEgeometry, new THREE.MeshBasicMaterial({}))
        this.THREEobj.position.z = 0
        //this.THREEobj = new THREE.Mesh(THREEgeometry, new THREE.PointsMaterial())
        scene.add(this.THREEobj)

        this.THREEobj.material.map = new THREE.TextureLoader().load("imgs/dirt.jpg");
        this.THREEobj.material.map.wrapS = this.THREEobj.material.map.wrapT = THREE.RepeatWrapping;
    }



}

class City {
    constructor(pos) {
        this.pos = pos
        this.bombed = false
        let texture = TexMap.get("city")
        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }))
        scene.add(this.sprite)


        this.sprite.position.set(pos.x, pos.y, 0)
        this.sprite.scale.set(64, 64, 64)
    }

    draw() {
        if (debug) {
            stroke(255)
            noFill()
            rect(this.pos.x - 32, this.pos.y - 64, 64, 64)
        }
    }


}

class AMB /* Anti-Missile Battery */ {
    constructor(pos) {
        this.pos = pos
        this.missiles = 10
        this.destroyed = false

        //calculate center of gun
        this.gunPos = pos.copy()
        this.gunPos.y += 23.5


        //THREE.JS data
        let texture = TexMap.get("amb_base")
        this.baseSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }))
        this.baseSprite.position.set(pos.x, pos.y + 10, 2)
        this.baseSprite.scale.set(64, 64, 64)


        //gun pipe
        let gun_texture = TexMap.get("amb_gun")
        this.gunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: gun_texture }))
        this.gunSprite.position.set(this.gunPos.x, this.gunPos.y, 1)
        this.gunSprite.scale.set(64, 64, 64)

        scene.add(this.baseSprite)
        scene.add(this.gunSprite)

    }

    draw(aim) {
        //Draw base


        //vec to mouse
        let aimVec = aim.copy().sub(this.gunPos).normalize().mult(30)


        if (debug) {
            noFill()
            stroke(255)
            rect(this.pos.x - 16, this.pos.y - 32, 32, 32)
            line(this.gunPos.x, this.gunPos.y, this.gunPos.x + aimVec.x, this.gunPos.y + aimVec.y)
        }
        //console.log(aimVec.heading())

        this.gunSprite.material.rotation = aimVec.heading() - PI / 2
        //set gun heading


        fill(120, 100, 50)
        for (let i = 0; i < this.missiles; i++) {
            rect(this.pos.x - 4, this.pos.y + 4 + (i * 10), 8, 4)

        }

    }
}

class Particle {
    constructor(pos, dir, variance) {
        this.pos = pos
        this.age = 0
        this.lifetime = random(20, 60)
        this.dir = dir.copy().mult(2).add(p5.Vector.random2D().mult(random() * variance))
        this.angle = random(0, 360)
        this.angvel = random(-1, 1) * 0.01


        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: TexMap.get("particle"), transparent: true, opacity: 0.1 }))
        this.sprite.material.depthWrite = false
        scene.add(this.sprite)
    }

    draw() {
        this.age++

        this.pos.add(this.dir)
        this.dir.mult(0.95)
        this.angle += this.angvel
        let size = this.age / this.lifetime
        this.sprite.material.opacity = 1 - size
        const scale = 20
        this.sprite.scale.set(size * scale + 2, size * scale + 2, 1)
        this.sprite.material.rotation = this.angle
        this.sprite.position.set(this.pos.x, this.pos.y, 1)


    }
}

class Explosion {
    constructor(pos) {
        this.pos = pos
        this.radius = 0
        this.time = 0
        this.lifetime = 70 //half
        this.sprite = new AnimatedSprite(TexMap.get("explosion"), 4, 7, 28, 0.1)
        this.sprite.position.set(pos.x, pos.y, 1)
        scene.add(this.sprite)
    }

    draw() {
        this.time++
        this.sprite.update(1/60)
        this.radius = random(50, 60)
        this.radius *= -(1 / (this.lifetime * this.lifetime)) * Math.pow(this.time - this.lifetime, 2) + 1

        let fac = this.time / (this.lifetime * 2)
        this.sprite.scale.set(this.radius, this.radius, 1)
    }

    remove() {
        scene.remove(this.sprite)
    }
}


class CounterMissile {
    constructor(pos, goal, speed) {
        this.pos = pos
        this.goal = goal
        this.speed = speed
        this.exploded = false

        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: TexMap.get("antiMissile") }))
        this.sprite.scale.set(32, 32, 1)
        scene.add(this.sprite)
    }

    draw() {
        this.speed += 0.04
        this.speed *= 0.98
        let vtg = p5.Vector.sub(this.goal, this.pos)
        let vtgnormalized = vtg.copy().normalize()
        this.pos.add(vtgnormalized.mult(this.speed))

        this.sprite.material.rotation = vtgnormalized.heading() - PI / 2
        this.sprite.position.set(this.pos.x, this.pos.y, 1)
        particles.push(new Particle(this.pos.copy().sub(vtgnormalized.copy().mult(5)), vtgnormalized.copy().mult(-1), 2 / (1 + this.speed)))
        if (p5.Vector.dist(this.pos, this.goal) < this.speed) {
            //at goal
            console.log("BOOOOOOOM")
            this.exploded = true

            //create Explosion
            explosions.push(new Explosion(this.pos))
        }
    }

    remove() {
        scene.remove(this.sprite)
    }
}

class Missile {
    constructor(speed) {
        this.pos = createVector(random(width), height + 10)
        //select random impact point
        let ip = random(width)
        this.speed = speed
        this.dir = createVector(ip, 0).sub(this.pos).normalize().mult(speed)

        //precalculate imapct point -> no collision detection every frame
        //collisiondetection
        let rcast = getClosestIntersection(new Line(this.pos.copy(), this.dir.copy()), ground.cmesh)
        this.impactPoint = rcast.intersect

        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: TexMap.get("missile") }))
        this.sprite.scale.set(32, 32, 1)
        scene.add(this.sprite)

        this.destroyed = false
    }

    draw() {
        this.pos.add(this.dir)


        this.sprite.material.rotation = this.dir.heading() - PI / 2
        this.sprite.position.set(this.pos.x, this.pos.y, 2)

        // missileMap.stroke(250, 150, 50)
        // missileMap.line(this.pos.x, this.pos.y, this.pos.x + this.dir.x, this.pos.y + this.dir.y)
        particles.push(new Particle(this.pos.copy(), this.dir.copy().mult(-1.5), 1))

        //collisiondetection
        //with dist^2 for better performance
        if ((this.pos.x - this.impactPoint.x) * (this.pos.x - this.impactPoint.x) + (this.pos.y - this.impactPoint.y) * (this.pos.y - this.impactPoint.y) <= this.speed * this.speed) {

            this.destroyed = true
        }
    }

    remove() {
        scene.remove(this.sprite)
    }
}



class AnimatedSprite extends THREE.Sprite {
    // note: texture passed by reference, will be updated by the update function.

    constructor(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
        super(new THREE.SpriteMaterial({map:texture}))
        this.tilesHorizontal = tilesHoriz;
        this.tilesVertical = tilesVert;
        // how many images does this spritesheet contain?
        //  usually equals tilesHoriz * tilesVert, but not necessarily,
        //  if there at blank tiles at the bottom of the spritesheet. 
        this.numberOfTiles = numTiles;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
        // how long should each image be displayed?
        this.tileDisplayDuration = tileDispDuration;
        // how long has the current image been displayed?
        this.currentDisplayTime = 0;
        // which image is currently being displayed?
        this.currentTile = 0;
        this.texture = texture
    }

   

    update(Sec) {
        this.currentDisplayTime += Sec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;
            if (this.currentTile == this.numberOfTiles)
                this.currentTile = 0;
            let currentColumn = this.currentTile % this.tilesHorizontal;
            this.texture.offset.x = currentColumn / this.tilesHorizontal;
            let currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
            this.texture.offset.y = currentRow / this.tilesVertical;

            console.log(currentColumn, currentRow)
        }
};
  }	
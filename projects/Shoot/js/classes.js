function map(v, a, b, c, d) {
  const fac = (v - a) / (b - a)
  return c + fac * (d - c)
}

/**
 * @typedef THREE.Vector2
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef THREE.Box2
 * @property {THREE.Vector2} min
 * @property {THREE.Vector2} max
 */

THREE.Vector2.prototype.reflect = function(normal) {
  const vn2 = this.dot(normal)*2
  return normal.clone().multiplyScalar(-vn2).add(this)
}

const TileIDs = {
  STONE:0,
  SEC4BLOCK:3
}

const TileTextureMats = [
  new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( "imgs/stone.png" ), color: 0xffffff } ),
  new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( "imgs/aim.png" ), color: 0xffffff } ),
  new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( "imgs/projectile.png" ), color: 0x000000 } ),
  new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( "imgs/stone.png" ), color: 0xffffff } )
]

class Tile extends THREE.Sprite {
  constructor(tileID, x, y) {
    super(TileTextureMats[tileID])
    this.tileID = tileID
    this.position.set(x || 0, y || 0, 0)
    this.lifeTime = (tileID==3)?4:Number.POSITIVE_INFINITY
    
    
  }
  /**@returns {THREE.Box2} */
  get box2() {
    return new THREE.Box2(new THREE.Vector2().add(this.position).sub({x: 0.5, y: 0.5}), new THREE.Vector2().add(this.position).add({x:0.5, y:0.5}))
  }

  update(dt) {
    this.lifeTime -= dt

    if(this.lifeTime < 0)return false

    return true
  }
}

class Projectile extends THREE.Sprite {
  constructor(startPos, startVel, duration, tileID) {
    super(TileTextureMats[2])


    this.tileID = tileID
    this.position.set(startPos.x, startPos.y, 1)
    this.velocity = startVel
    this.duration = duration



    this.scale.set(0.3, 0.3, 0.3)
    scene.add(this)
  }

  /**@returns {THREE.Vector2} */
  get pos2() {
    return new THREE.Vector2().add(this.position)
  }

  update(dt) {
    let oldPos = this.position.clone()
    let possibleTiles = World.getCloseTiles(oldPos, 2)
    this.duration-= dt

    if(this.duration < 0) {
      //create new Block were projectile was, delete this
      console.log('Creating new Tile')
      let tile = new Tile(this.tileID, oldPos.x, oldPos.y)
      World.tiles.push(tile)
      scene.add(tile)
      return false
    }

    this.velocity.add(GRAVITY.clone().multiplyScalar(dt))
    
    this.position.x += this.velocity.x * dt
    this.position.y += this.velocity.y * dt

    this.material.rotation = this.velocity.angle() - Math.PI / 2
    projectileTracks.geometry.vertices.push(new THREE.Vector3(oldPos.x, oldPos.y, 1))
    projectileTracks.geometry.verticesNeedUpdate = true

    //do all in one move
    let p2 = this.pos2
    for(let pt of possibleTiles) {
      if(pt.box2.containsPoint(p2)) {
        this.position.set(oldPos.x, oldPos.y, oldPos.z)
        
        
        if(pt.box2.containsPoint(p2)) {
          //if still colliding
        }
        //reflect movement, get direction from box center
        let b2c = pt.box2.getCenter()
        let v2p = this.pos2.sub(b2c)
        //set smaller component if v2p = 0
        if(Math.abs(v2p.x) < Math.abs(v2p.y)) v2p.x = 0
        else v2p.y = 0
        v2p.normalize()
        
        //only reflect velocity if projectile is moveing towards center
        console.log(v2p, this.velocity, v2p.dot(this.velocity))
        if(v2p.dot(this.velocity) > 0) continue
        this.velocity = this.velocity.reflect(v2p)
      }
    }
    return true
  } 

}

/**
 * @namespace
 */
const World = {
  /**@type {Array<Tile>} */
  tiles: [],
  /**@type {Array<Projectile>} */
  projectiles: [],
  init() {
      
  },
  /**@returns {Array<Tile>} */
  getCloseTiles(pos, radius) {
    //TODO naive implementation, improve filtering 
    return this.tiles.filter(t => pos.distanceTo(t.position) <= radius)
  },

  update(dt) {
    this.projectiles.forEach((projectile, index) => {
      if(!projectile.update(dt)){
        this.projectiles.splice(index, 1)
        scene.remove(projectile)
      }
    })

    this.tiles.forEach((t, i) => {
      if(!t.update(dt)) {
        this.tiles.splice(i, 1)
        scene.remove(t)
      }
    })
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
const Player = {
  position: new THREE.Vector2(0, 0),
  velocity: new THREE.Vector2(0, 0),
  threeAimLine: null,
  threeAimSprite: null,
  shootCooldown: 0,

  /**@returns {THREE.Box2} */
  get box2() {
    return new THREE.Box2(this.position.clone().sub({x:0.3,y:0.5}), this.position.clone().add({x:0.3, y:0.5}))
  },

  sBody: new THREE.Sprite(new THREE.SpriteMaterial( { map: new THREE.TextureLoader().load( "imgs/body.png" ), color: 0xffffff } )),
  onGround: false,
  init() {

    let lineMat = new THREE.LineDashedMaterial( {
      color: 0xffffff,
      dashSize: 0.1,
      gapSize: 0.1,
    } )

    let geo = new THREE.Geometry()
    geo.vertices.push(new THREE.Vector3(0, 0, 0))
    geo.vertices.push(new THREE.Vector3(5, 5, 0))

    this.threeAimLine = new THREE.Line(geo, lineMat)
    this.threeAimLine.geometry.computeLineDistances()
    scene.add(this.threeAimLine)

    scene.add(this.sBody)
    this.threeAimSprite = new THREE.Sprite(TileTextureMats[1])
    this.threeAimSprite.scale.set(0.5, 0.5, 0.5)
    scene.add(this.threeAimSprite)


  },
  /**
   * 
   * @param {Tile} tile 
   */
  checkIntersection(tile) {

    let intersects = this.box2.intersectsBox(tile.box2)
    if(intersects) {

      //Check if is ground
      if(tile.box2.max.y + 0.1 > this.box2.min.y ) {
        this.onGround = true
      }
    }
    return intersects
  },

  update(dt) {

    //reset data for new frame
    this.onGround = false

    dt = dt || 1/60

    this.velocity.add(GRAVITY.clone().multiplyScalar(dt))

    let oldPos = this.position.clone()

    

    //get all close tiles 
    let possibleTiles = World.getCloseTiles(oldPos, 2)

    //--do x-axis update--
    this.position.x += this.velocity.x * dt

    //check collisions
    let b2 = this.box2
    if(!possibleTiles.every(t => !this.checkIntersection(t))) {
      this.position = oldPos.clone()
      
    }
    
    //--do y-axis update--
    oldPos.x = this.position.x
    this.position.y += this.velocity.y * dt
    
    //check collisions
    b2 = this.box2
    if(!possibleTiles.every(t => !this.checkIntersection(t))) {
      this.position = oldPos  
    }

    //if still intersects: move away from centers
    possibleTiles.forEach(t => {
      if(this.box2.intersectsBox(t.box2)) {
        //get vec from tile center to player center, move away
        let v2p = this.box2.getCenter().sub(t.box2.getCenter())
        v2p.setLength(0.1)
        this.position.add(v2p)

      }
    })
    
    
    
    this.velocity.x *= this.onGround?0.7:0.9
    

    //friction of air ~ v^2 
    let velMagSq = this.velocity.lengthSq()
    this.velocity.multiplyScalar(1 - Math.min(velMagSq * 0.001, 0.9))
    
    this.sBody.position.set(this.position.x, this.position.y, 0)

    let mouseWorldPos = new THREE.Vector3(map(Mouse.x, 0, width, -1, 1), map(Mouse.y, 0, height, -1, 1), 0).unproject(cam)
    
    
    //update aim geometry
    this.threeAimLine.geometry.vertices[0].set(this.position.x, this.position.y, 0)
    this.threeAimLine.geometry.vertices[1].set(mouseWorldPos.x, mouseWorldPos.y, 0)
    this.threeAimLine.geometry.verticesNeedUpdate = true
    this.threeAimLine.geometry.computeLineDistances()
    this.threeAimLine.geometry.lineDistances = this.threeAimLine.geometry.lineDistances.map(e => e -= totalTime * 0.3)
    this.threeAimLine.geometry.lineDistancesNeedUpdate = true

    //update aim sprite
    this.threeAimSprite.position.set(mouseWorldPos.x, mouseWorldPos.y, 0)

    //MOVEMENT
    //console.log(this.mBody.angle)
    if(Keyboard.getDown(87) && this.onGround) this.velocity.y = 7
    const WALKSPEED = 5
    if(Keyboard.getDown(68)) this.velocity.x = THREE.Math.lerp(this.velocity.x, WALKSPEED, 0.2)
    
    if(Keyboard.getDown(65)) this.velocity.x = THREE.Math.lerp(this.velocity.x, -WALKSPEED, 0.2)
    

    this.shootCooldown++
    if(Keyboard.getDown(32) && this.shootCooldown > 30) {
      this.shootCooldown = 0
      //shoot
      console.log('Shoot')
      //vector to mouse
      let v2m = mouseWorldPos.clone().sub(this.position).multiplyScalar(2)
      v2m = new THREE.Vector2(v2m.x, v2m.y)
      v2m.clampLength(0, 10)
      let projectile = new Projectile(this.position, v2m, projectileTimeManager.time, TileIDs.SEC4BLOCK)
      World.projectiles.push(projectile)
    }

    
  }


}
class BasicCar {


    constructor(texture, pos, dir) {
        //more to come
        this.texture = texture
        this.sprite = new THREE.Sprite(new THREE.SpriteMaterial( {map:texture, color:0xffffff} ))
        scene.add(this.sprite)
        this.sprite.position = pos
        this.sprite.material.rotation = dir
        this.engine = new Engine(100)
    }


    update() {
        //set 
    }

}


class Engine {
    constructor(hp) {
        this.hp = hp
    }
}
//create UI 

//based on https://www.evermade.fi/pure-three-js-hud/
let UI = {
    canvas: document.createElement("canvas"),
    context: null,
    camera: null,
    scene: null,
    texture: null,
    material: null,
    mesh: null,

    init: function(w, h){
        this.w = w
        this.h = h
        this.canvas.width = w
        this.canvas.height = h

        this.context = this.canvas.getContext("2d")
        this.context.font = "Normal 40px Arial"
        this.context.textAlign = 'center'
        this.context.fillStyle = "rgba(245,245,245,0.75)"
        this.context.fillText('Initializing...', w / 2, h / 2)

        //cam
        this.camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 0, 30);

        //scene
        this.scene = new THREE.Scene()

        //tex
        this.texture = new THREE.Texture(this.canvas)
        this.texture.minFilter = THREE.NearestFilter 
        this.texture.needsUpdate = true


        //material
        this.material = new THREE.MeshBasicMaterial( {map: this.texture} )
        this.material.transparent = true
        this.mesh = new THREE.Mesh( new THREE.PlaneGeometry( w, h ), this.material )

        this.scene.add(this.mesh)

    },

    clear: function() {
        this.context.clearRect(0, 0, this.w, this.h)
    },

    render: function(renderer) {
        //must be called after main scene render
        this.texture.needsUpdate = true
        renderer.render(this.scene, this.camera)
    }
}

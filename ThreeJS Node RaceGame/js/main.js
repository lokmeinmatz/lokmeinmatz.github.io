/*
    ______
    |INFO|


z-Sorting : higher -> more visible



Ideas

World : Tiles (Texture and collsion for performance)
Controller Steering
Friction simulation (Mesh or Texture)?


*/

let frameCounter = 0

function init() {
    var scene = new THREE.Scene();

    var swidth =  10
    var sheight = 10 * window.innerHeight / window.innerWidth
    var pxwidth = window.innerWidth
    var pxheight = window.innerHeight
    var camera = new THREE.OrthographicCamera( swidth / - 2, swidth / 2, sheight / 2, sheight / - 2, 1, 1000 )
    camera.position.z = 100
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    
    UI.init(pxwidth, pxheight)

    //test
    let carTex = new THREE.TextureLoader().load("imgs/car.png")
    let carSprite = new THREE.Sprite(new THREE.SpriteMaterial( {map:carTex, color:0xffffff} ))
    scene.add( carSprite )

    let carTex2 = new THREE.TextureLoader().load("imgs/car2.png")
    let carSprite2 = new THREE.Sprite(new THREE.SpriteMaterial( {map:carTex2, color:0xffffff} ))
    scene.add( carSprite2 )



    function animate() {
        renderer.render( scene, camera );



        /*
        --------------------
        ---------UI---------
        --------------------
        */
        UI.clear()
        UI.context.fillText(frameCounter.toString(), pxwidth/2, pxheight/2)
        UI.render(renderer)



        frameCounter ++;
        requestAnimationFrame( animate );
    }
    animate();
}






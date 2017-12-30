class Menu extends GameState {
    constructor() {
        super()
        this.playButton = new Button(width/2 - 75, 100, 100, 35, "PLAY", "playbutton", function() {
            console.log("clicked play")
            currentState = "game"
        })
        this.logo = loadImage("res/imgs/logo.png")
        this.cloud = loadImage("res/imgs/cloud1.png") //TODO global textures (Map)
        this.cloudData = [] // s = speed

        for(let i = 0; i < 10; i++) {
            this.cloudData.push({x:random(-500, -100), y:random(20, 100), s:random(0.2, 1.0)})
        }
    }

    draw() {
        background(100, 150, 150)

        //Draw bg
        for(let c of this.cloudData) {
            image(this.cloud, c.x, c.y)
        }



        image(this.logo, width/2 - 100, 20)

        this.playButton.draw()
    }

    update() {
        this.playButton.update()

        for(let c of this.cloudData) {
            c.x += c.s

            if(c.x > width + 10) {
                //reset
                c.x = random(-150, -100)
                c.y = random(20, 100)
                c.s = random(0.2, 1.0)
            }
        }
    }

    reset() {
        
    }
}


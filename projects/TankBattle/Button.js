class Button {
    constructor(x, y, width, height, text, imageName, onClick) {
        //TODO textures
        this.x = x
        this.y = y
        this.text = text
        this.hover = false
        this.onClick = onClick //Gets called when mouse up on button
        
        this.width = 0
        this.height = 0

        //load textures
        this.texture = loadImage("res/imgs/"+imageName+".png", (tex) => {
            this.width = tex.width
            this.height = tex.height
        })
        this.textureHover = loadImage("res/imgs/"+imageName+"_hover.png")
        
        
        this.width = 0
        this.height = 0
    }

    update() {
        //check for collision
        //AABB collision
        if(mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height) {
           
            //inside area -> highlight button
            this.hover = true
            //klick
            if(mouseWasPressed && !mouseIsPressed) {
                //execute onClick
                this.onClick()
            }
        }
        else {this.hover = false}
    }

    draw() {
        if(this.hover) {
            image(this.textureHover, this.x, this.y)
        }
        else {
            image(this.texture, this.x, this.y)
        }
        
    }
}
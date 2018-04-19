
function updateCanvasStyle() {
    let canvasstyle = document.getElementsByTagName("canvas")[0].style

    let canvasRatio = width / height
    let windowRatio = window.innerWidth / window.innerHeight

    if(windowRatio < canvasRatio) {
        canvasstyle.height = "auto"
        canvasstyle.width  = "100vw"
    }
    else {
        canvasstyle.height = "100vh"
        canvasstyle.width  = "auto"
    } 
}
let allStates = new Map() //string -> GameState
let currentState = "menu"
let fonts = new Map()

let mouseWasPressed = false
function setup() {
    createCanvas(400, 300)
    window.addEventListener("resize", updateCanvasStyle)
    updateCanvasStyle()
    background(255)
    fonts.set("8bit", loadFont("res/fonts/8bitFont.ttf"))
    textSize(20)
    textFont(fonts.get("8bit"))



    //init game states
    allStates.set("menu", new Menu())

    allStates.set("game", new Game())
}

function draw() {
    let state = allStates.get(currentState)
    state.update()
    state.draw()


    mouseWasPressed = mouseIsPressed
}
const BOMB = -100
const EMPTY = 0

const fWidth = 10
const fHeight = 8
const difficulty = 10
let bombCount = 0
let cellsToDiscover = 0

let field = []

const xoffset = [0, 1, 1, 1, 0, -1, -1, -1];
const yoffset = [1, 1, 0, -1, -1, -1, 0, 1];

let state = 0 // 0 : playing, 1 : won, 2 : lost, 3 : reset
let flagMode = false

class Cell {
  constructor(DOMelmt, x, y) {
    this.discovered = false
    this.state = 0
    this.flag = false
    this.prob = 0.0
    this.DOM = DOMelmt


    this.DOM.click(() => {
      if(flagMode) this.DOM.contextmenu()
      else {
        console.log(`Clicked ${x} ${y}`)
        undiscover(x, y)
        calcCellsToDiscover()
        this.DOM.css('background-color', 'transparent')
      }
    })

    this.DOM.contextmenu(() => {
        this.flag = !this.flag

        this.DOM.text(this.flag?"🚩":"")
        return false
    })
  }

  discover() {
    this.discovered = true
    this.DOM.addClass('discovered')
    if(this.state > 0)this.DOM.text(this.state)
    else if(this.state == BOMB)this.DOM.text("💣")
  }

  reset() {
    this.discovered = false
    this.DOM.removeClass('discovered')
    this.DOM.text('')
  }

  delete() {
    this.DOM.remove()
  }
}

function reset() {
  state = 3

  let index = fWidth * fHeight - 1

  let interval = setInterval(() => {
    field[index % fWidth][(index - (index % fWidth)) / 10].reset()
    index --

    if(index < 0){
      clearInterval(interval)
      state = 0
      generateMap()
    }
  }, 10)
}

/**
 * @description Generates new map (field) with dimensions fWidth x fHeight and builds DOM-Elements
 */
function generateMap(){
  const grid = $(".grid")
  for(var x = 0; x < fWidth; x++){
    if(!field[x])field[x] = new Array(fHeight);

    for(var y = 0; y < fHeight; y++){
      if(field[x][y])field[x][y].delete()
      const DOMcell = $("<div>").addClass('cell')
      DOMcell.css('grid-row', (y + 1).toString())
      DOMcell.css('grid-column', (x + 1).toString())
      
      grid.append(DOMcell)
      field[x][y] = new Cell(DOMcell, x, y);
    }
  }

  //generate bombs
  bombCount = difficulty;
  console.log("Bomben im Spiel: "+bombCount);
  for (var i = 0; i < bombCount; i++){
    while(true){
      let bombx = Math.floor(Math.random() * fWidth);
      let bomby = Math.floor(Math.random() * fHeight);

      if(field[bombx][bomby].state != BOMB){
        field[bombx][bomby].state = BOMB;
        break;
      }
    }
  }
  calcDistances();
}

function onUpdateGameState() {
  if(state == 1 || state == 2) {
    state == 3
    setTimeout(reset, 1000)
  }
}

/**
 * @description Calculates all undiscovered Cells
 */
function calcCellsToDiscover(){
  if(state != 0) {
    return
  }
  cellsToDiscover = 0;
  for(var x = 0; x < fWidth; x++){
    for(var y = 0; y < fHeight; y++){
      if(!field[x][y].discovered)cellsToDiscover++;
    }
  }

  $("header h1").text(`Bombs: ${bombCount} | Remaining Cells: ${cellsToDiscover - bombCount}`)

  if(cellsToDiscover - bombCount == 0) {
    //won game
    $("header h1").text("You won!!!")
    state = 1
    onUpdateGameState()
  }
}


/**
 * @description Calculates adjacent bombs of all Cells
 */
function calcDistances(){
  for(var x = 0; x < fWidth; x++){
    for(var y = 0; y < fHeight; y++){

      if(field[x][y].state != BOMB){
        //count next bombs

        for(var i = 0; i < 8; i++){
          if(x + xoffset[i] >= 0 && x + xoffset[i] < fWidth &&
             y + yoffset[i] >= 0 && y + yoffset[i] <   fHeight && field[x + xoffset[i]][y + yoffset[i]].state == BOMB)
          {
            field[x][y].state += 1;
          }
        }
      }
    }
  }
}

/**
 * @description undiscovers clicked cell
 * 
 * @param {number} x x-position of clicked tile
 * @param {number} y x-position of clicked tile
 */
function undiscover(x, y) {
  if(field[x][y].discovered || field[x][y].flag) {return}

  
  field[x][y].discover();

  if(field[x][y].state == BOMB){
    $("header h1").text("Yo lost!!!")
    state = 2
    onUpdateGameState()
    return
  }
  var fieldsToVisit = [];

  if(field[x][y].state == 0 ){

    fieldsToVisit.push({x: x, y:y})
  }
  else {return}

  //Floodfill all empty adjacent tiles
  while(fieldsToVisit.length > 0){
    let coords = fieldsToVisit.shift();

    field[coords.x][coords.y].discover();

    if(field[coords.x][coords.y].state == 0 ){
      for(var i = 0; i < 8; i++){
        if(coords.x + xoffset[i] >= 0 && coords.x + xoffset[i] < fWidth &&
          coords.y + yoffset[i] >= 0 && coords.y + yoffset[i] < fHeight){
          if(field[coords.x][coords.y].state == 0 && !field[coords.x + xoffset[i]][coords.y + yoffset[i]].discovered)
          {
            fieldsToVisit.push({x: coords.x + xoffset[i], y: coords.y + yoffset[i]});
          }

        }
      }
    }
  }
}

$(function () {
  console.log("Started MineSweeper")

  

  //Create field
  generateMap()
  calcCellsToDiscover()

  $("#flagMode").click(function() {
    flagMode = !flagMode
    $(this).text(flagMode?"Disable FlagMode" : "Enable FlagMode").toggleClass('active', flagMode)
  })

  $("#cheat").click(function() {
    const prob = getBestSolution()
    console.log(prob)
    if(prob) {
      //color back all cells
      for(var x = 0; x < fWidth; x++){
        for(var y = 0; y < fHeight; y++){
          field[x][y].DOM.css('background-color', 'transparent')
        }
      }

      for(let cell of prob) {
        const cellDOM = field[cell.x][cell.y].DOM

        if(cell.prob == 0) cellDOM.css('background-color', `rgb(0, 200, 20)`)
        else if(cell.prob < 0.5) cellDOM.css('background-color', `rgb(120, 150, 20)`)
        else if(cell.prob < 1) cellDOM.css('background-color', `rgb(150, 120, 20)`)
        else cellDOM.css('background-color', `rgb(200, 0, 20)`)
        

        if(cell.prob == 0) {
          //field[cell.x][cell.y].DOM.click()
        }
      }
    }
  })

})
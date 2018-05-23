
let UItable = [];




//....
// Watchable valid booean
function setValid(value) {
  _validInputs = value
  $('#solve').text(value?'solve':'invalid')
}

const isValid = () => _validInputs
let _validInputs = true;
//....


function updateUI() {
  UItable.forEach(e => e.updateUI())
}

function clearTable() {
  UItable.forEach(e => {
    e.value = undefined
    e.state = STATES.EMPTY
    e.fixed = false
    e.updateUI()
  })
}

function solve(){
  /*
  Loop: insert 1 in first unfixed cell, validate table, if valid: move to next cell
  if invalid: increment to 2
  when 9 is reached ( 10 ) : go back (backtrack) to next last unfixed cell
  */

  let currentPointer = 0
  while(true) {
    //updateUI()
    //set value at current pointer / increment
    while(currentPointer < UItable.length && UItable[currentPointer].fixed){
      currentPointer++
    }
    if(currentPointer >= UItable.length)return //reached end
    //now found unfixed or reached end
    
    
    
    //set or increment
    //check if value is greater than 9 => move back
    while(UItable[currentPointer].value >= 9) {
      UItable[currentPointer].value = undefined
      do {
        currentPointer--
        if(currentPointer < 0) {
          $('#solve').text('unsolvable')
          return
        }
      } while (UItable[currentPointer].fixed);
    }
    if(UItable[currentPointer].value == undefined)UItable[currentPointer].value = 1
    else UItable[currentPointer].value++


    //check if valid
    if(validate()){
      currentPointer++
    }
  }

}

let STATES = {
  VALID: 1,
  INVALID: -1,
  EMPTY: 0,
};

function generate() {
  const grid = $('.grid')
  for(let y = 0; y < 9; y++) {
    for(let x = 0; x < 9; x++) {
      //create HTML elements
      let input = $('<input class="empty" type="text" maxlength="1"/>')
      let gridx = (x+1) + Math.floor(x / 3)
      let gridy = (y+1) + Math.floor(y / 3)
      input.css('grid-column', gridx.toString())
      input.css('grid-row', gridy.toString())
      grid.append(input)

      let cell = new Cell(x, y, input)
      UItable.push(cell)
    }
  }
}
class Cell {

  /**
   * @constructor
   * @param {number} x position-x value
   * @param {number} y position-x value
   * @param {JQuery} html jquery dom element
   */

  constructor(x, y, html){
    this.x = x
    this.y = y
    this.value = undefined
    this.state = STATES.EMPTY
    this.fixed = false
    this.html = html

    this.html.on('input', (e) => {
      let val = e.target.value
      try {
        val = parseInt(val)
  
        if(val < 1 || val > 9 || isNaN(val)){
        
          this.value = undefined
          this.fixed = false
        }
        //new value is now a number between 1 and 9
        else {
          this.value = val
          this.fixed = true
        }
      } catch (e) {
        console.log(e)
        this.value = undefined
        this.fixed = false
      }    
      
      //autovalidation on input change
      //validate() returns true if valid
      setValid(validate())

      updateUI()
    })
    this.possible = [];
  }

  updateUI() {

    //Sets value of dom
    if(this.value == undefined) this.html.val('')
    else this.html.val(this.value.toString())

    this.html.toggleClass('fixed', this.fixed)

    switch (this.state) {
      case STATES.EMPTY:
        this.html.removeClass("valid");
        this.html.removeClass("invalid");
        this.html.addClass("empty");
        break;

      case STATES.VALID:
        this.html.removeClass("invalid");
        this.html.removeClass("empty");
        this.html.addClass("valid");
        break;

      case STATES.INVALID:
        this.html.removeClass("valid");
        this.html.removeClass("empty");
        this.html.addClass("invalid");
        break;

      default:

    }
  }

}


$(function(){

  //generate grid
  generate()

  $('#solve').click(function() {
    
    if(isValid()){
      //solve sudoku
      console.log('solving...')
      solve()
      console.log('Solved')
      updateUI()
    }
    
  })

  $('#clear').click(clearTable)

})


function validate(){
  let valid = true

  //Set all to valid on start, and change back when same value is in row/column/block => no overwriting
  UItable.forEach(e => {
    if(e.value == undefined){
      e.state = STATES.EMPTY
    }
    else {
      e.state = STATES.VALID
    }
  })
  
  //check rows
  for(let row = 0; row < 9; row++) {
    for(let x1 = 0; x1 < 9; x1++) {
      const cell1 = UItable[row * 9 + x1]


      //no need to test if cell1's value is undefined
      if(cell1.value == undefined) continue
      
      for(let x2 = x1 + 1; x2 < 9; x2++) {
        const cell2 = UItable[row * 9 + x2]
        
        //no need to test if cell2's value is undefined
        if(cell1.value == cell2.value && cell2.value != undefined) {
          valid = false
          cell1.state = STATES.INVALID
          cell2.state = STATES.INVALID
        }
      }
    }
  }  

  //check columns
  for(let column = 0; column < 9; column++) {
    for(let y1 = 0; y1 < 9; y1++) {
      const cell1 = UItable[y1 * 9 + column]


      //no need to test if cell1's value is undefined
      if(cell1.value == undefined) continue
      
      for(let y2 = y1 + 1; y2 < 9; y2++) {
        const cell2 = UItable[y2 * 9 + column]

        //no need to test if cell2's value is undefined
        if(cell1.value == cell2.value && cell2.value != undefined) {
          valid = false
          cell1.state = STATES.INVALID
          cell2.state = STATES.INVALID
        }
      }
    }
  }
  
  //check boxes
  for(let bx = 0; bx < 3; bx++) {
    for(let by = 0; by < 3; by++) {

      for(let i1 = 0; i1 < 9; i1++) {

        //calculate position in table []
        let index1 = by * 9 * 3 + bx * 3
        //add rows offset
        index1 += Math.floor(i1 / 3) * 9
        index1 += i1 % 3


        const cell1 = UItable[index1]
        
        //no need to test if cell1's value is undefined
        if(cell1.value == undefined) continue
        
        for(let i2 = i1 + 1; i2 < 9; i2++) {

          //calculate position in table []
          let index2 = by * 9 * 3 + bx * 3
          //add rows offset
          index2 += Math.floor(i2 / 3) * 9
          index2 += i2 % 3
          const cell2 = UItable[index2]
          
          //no need to test if cell2's value is undefined
          if(cell1.value == cell2.value && cell2.value != undefined) {
            
            valid = false
            cell1.state = STATES.INVALID
            cell2.state = STATES.INVALID
          }
        }
      }

    }
  }

  return valid

}

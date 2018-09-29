function componentToHex(c : number) {
  var hex = c.toString(16)
  return hex.length == 1 ? "0" + hex : hex
}

function rgbToHex(r : number, g : number, b : number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b)
}




class Cell {
  private _char : string = " "
  elmt : HTMLElement 
  private _bgcolor: string = "#000000"
  private _textcolor: string = "#ffffff"
  private _fontsize : number = 30;

  get char() : string {return this._char}
  set char(chr : string) {
    this._char = chr
    this.elmt.textContent = chr
  }

  get bgColor() : string {return this._bgcolor}
  set bgColor(color : string) {
    this._bgcolor = color
    this.elmt.style.backgroundColor = color
  }

  get textColor() : string {return this._textcolor}
  set textColor(color : string) {
    this._textcolor = color
    this.elmt.style.color = color
  }

  get fontSize() : number {return this._fontsize}
  set fontSize(val : number) {
    this._fontsize = val
    this.elmt.style.fontSize = val.toString() + "px"
  }

  constructor(parent : HTMLElement, x: number, y: number, char? : string) {
    this.elmt = document.createElement("p")
    parent.appendChild(this.elmt)

    this.char = char
    this.bgColor = "#000000"
    this.textColor = "#31A83A"
    this.elmt.style.gridRow = (y+1).toString() + " / span 1"
    this.elmt.style.gridColumn = (x+1).toString() + " / span 1"
  }

  mouseOver(callback: (e : MouseEvent) => void) {
    this.elmt.onmouseover = callback
  }

  mouseLeave(callback: (e : MouseEvent) => void) {
    this.elmt.onmouseleave = callback
  }

  mouseClick(callback: (e : MouseEvent) => void) {
    this.elmt.onclick = callback
  }
  
}

interface DataCell {
  char?: string 
  bgColor? : string
  textColor? : string
}


class webTerminal {
  width : number = 0
  height : number = 0
  parent: HTMLElement
  cells : Cell[]
  updateFn : () => void

  mouse = {
    cellX: 0,
    cellY: 0
  }

  constructor(element : HTMLElement) {
    this.parent = element
    this.width = parseInt(element.getAttribute("width"))
    this.height = parseInt(element.getAttribute("height"))
    this.cells = new Array<Cell>(this.width * this.height)
    console.log(`Creating webTerminal with ${this.width} x ${this.height} cells`)
    element.classList.add("terminal")
    element.style.display = "grid"
    element.style.gridTemplateRows = `repeat(${this.height}, 1fr)`
    element.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`

    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        this.cells[y * this.width + x] = new Cell(element, x, y, "")
      }
    }

    window.onresize = this.recalcFontSize
    
    this.recalcFontSize()


    element.onmousemove = (e) => {
      let x : number = e.layerX
      let y : number = e.layerY

      //calculate cell where mouse is hovering over
      let bounding = this.parent.getBoundingClientRect()
      x /= bounding.width / this.width
      y /= bounding.height / this.height
      x -= 0.5
      y -= 0.5
      x = Math.max(Math.floor(x), 0)
      y = Math.max(Math.floor(y), 0)
      this.mouse.cellX = x
      this.mouse.cellY = y
    }


    this.updateFrame()
  }

  updateFrame() {
    if(this.updateFn) {
      this.updateFn()
    }
    //console.log(this.updateFrame)
    requestAnimationFrame(this.updateFrame.bind(this))
  }

  recalcFontSize(newSize?: number | any) {
    if(!newSize || isNaN(newSize)) {
      //recalculate
      let bounding = this.parent.getBoundingClientRect()
      //vertical max size
      let cellHeight = bounding.height / this.height * 0.7
      //horizontalmaxsize
      let cellWidth = bounding.width / this.width

      let maxSize = Math.min(cellWidth, cellHeight)
      console.log(maxSize)
      newSize = maxSize
    }
    for(let cell of this.cells) {   
      cell.fontSize = newSize
    }
  }

  displayCells(cells : DataCell[], x : number, y : number, wrap : boolean = true) {
    for(let index = 0; index < cells.length; index++) {
      let posx = (x + index) % this.width
      let posy = y + Math.floor((x + index) / this.width)
      if(posx >= this.width || posy >= this.height) continue
      let dcell = cells[index]
      let uiCell = this.cells[posy * this.width + posx]
      if(dcell.char) uiCell.char = dcell.char
      if(dcell.bgColor) uiCell.bgColor = dcell.bgColor
      if(dcell.textColor) uiCell.textColor = dcell.textColor
    }
  }

  displayBuffer(cells: DataCell[], offset? : number) {
    for(let i = 0; i < cells.length; i++) {
      let idx = i + offset
      if(idx >= this.cells.length) return

      let dcell = cells[i]
      let uiCell = this.cells[idx]
      if(dcell.char) uiCell.char = dcell.char
      if(dcell.bgColor) uiCell.bgColor = dcell.bgColor
      if(dcell.textColor) uiCell.textColor = dcell.textColor
    }
  }

  displayString(str : string, x : number, y : number, wrap? : boolean) {
    for(let index = 0; index < str.length; index++) {
      let posx = (x + index) % this.width
      let posy = y + Math.floor((x + index) / this.width)
      if(posx >= this.width || posy >= this.height) continue
      this.cells[posy * this.width + posx].char = str.charAt(index)
    }
  } 

  clear(bgColor?: string, textColor? : string) {
    this.cells.forEach(c => {
      c.char = ""
      c.bgColor = bgColor ? bgColor : '#000000'
      c.textColor = textColor ? textColor : '#ffffff'
    })
  }
}
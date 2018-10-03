let terminal
function init() {
  console.log('loading completed')
  let termElmt = document.getElementById("terminal")
  if(termElmt.requestFullscreen) {
    termElmt.requestFullscreen()
  }
  terminal = new webTerminal(termElmt)

  terminal.updateFn = update

  for(let i = 0; i < terminal.width * terminal.height; i++) {
    buffer[i] = Math.random() < 0.5 ? {char: '0'} : {char : '1'}
  }
}



let buffer = []

function update() {
  
  //terminal.clear("#000000", "#31A83A")
  buffer.shift()
  buffer.push(Math.random() < 0.5 ? {char: '0'} : {char : '1'})

  terminal.displayBuffer(buffer)


  //taskbar
  
}